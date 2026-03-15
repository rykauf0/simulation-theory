import { WebSocketServer, WebSocket } from 'ws';
import type { IncomingMessage } from 'http';
import type { ClientMessage, ServerMessage } from '@/types/ws-messages';
import { SimulationOrchestrator } from '@/engine/orchestrator';
import { getSimulation } from '@/lib/simulation-store';
import { v4 as uuid } from 'uuid';
import type { AgentResult, AgentRole, SimulationRound } from '@/types/simulation';
import type { OrganismState } from '@/types/organism';

// Track client subscriptions
const clientSubscriptions = new Map<WebSocket, Set<string>>();
const activeOrchestrators = new Map<string, SimulationOrchestrator>();

export function createWebSocketHandler(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket, _req: IncomingMessage) => {
    clientSubscriptions.set(ws, new Set());

    ws.on('message', (data) => {
      try {
        const message: ClientMessage = JSON.parse(data.toString());
        handleClientMessage(ws, message);
      } catch (err) {
        sendToClient(ws, {
          type: 'error',
          payload: { message: 'Invalid message format', code: 'PARSE_ERROR' },
        });
      }
    });

    ws.on('close', () => {
      clientSubscriptions.delete(ws);
    });
  });
}

function handleClientMessage(ws: WebSocket, message: ClientMessage) {
  switch (message.type) {
    case 'start_simulation': {
      const { companyName, context, config } = message.payload;

      // Create simulation via API would already be done, but we can handle it here too
      const simId = uuid();
      const { createSimulation } = require('@/lib/simulation-store');
      const defaultConfig = {
        agentCount: 6,
        roundCount: 1,
        model: 'claude-sonnet-4-20250514',
        enabledRoles: [
          'market_analyst',
          'financial_analyst',
          'geopolitical_risk',
          'supply_chain',
          'talent_culture',
          'technology',
        ] as AgentRole[],
        ...config,
      };

      createSimulation(simId, companyName, context || '', defaultConfig);

      // Subscribe this client
      subscribeClient(ws, simId);

      // Notify client
      sendToClient(ws, {
        type: 'simulation_created',
        payload: { simulationId: simId, config: defaultConfig },
      });

      // Start orchestrator
      startOrchestrator(simId);
      break;
    }

    case 'subscribe': {
      const { simulationId } = message.payload;
      subscribeClient(ws, simulationId);

      // If there's an existing simulation, start it if not already running
      const sim = getSimulation(simulationId);
      if (sim && sim.status === 'initializing') {
        sendToClient(ws, {
          type: 'simulation_created',
          payload: { simulationId, config: sim.config },
        });
        startOrchestrator(simulationId);
      }
      break;
    }

    case 'inject_event': {
      const { simulationId, event } = message.payload;
      const orchestrator = activeOrchestrators.get(simulationId);
      if (orchestrator) {
        orchestrator.injectEvent(event);
      }
      break;
    }

    case 'request_summary': {
      const { simulationId } = message.payload;
      handleSummaryRequest(ws, simulationId);
      break;
    }

    case 'pause_simulation': {
      const { simulationId } = message.payload;
      const orchestrator = activeOrchestrators.get(simulationId);
      if (orchestrator) {
        orchestrator.pause();
      }
      break;
    }

    case 'resume_simulation': {
      const { simulationId } = message.payload;
      const orchestrator = activeOrchestrators.get(simulationId);
      if (orchestrator) {
        orchestrator.resume();
      }
      break;
    }
  }
}

function startOrchestrator(simulationId: string) {
  if (activeOrchestrators.has(simulationId)) return;

  const orchestrator = new SimulationOrchestrator();
  activeOrchestrators.set(simulationId, orchestrator);

  // Wire up events to broadcast to subscribed clients
  orchestrator.on('agent:started', (data: { simulationId: string; role: string }) => {
    broadcast(simulationId, {
      type: 'agent_started',
      payload: { simulationId, agentId: data.role, role: data.role as AgentRole },
    });
  });

  orchestrator.on('agent:complete', (data: { simulationId: string; result: AgentResult }) => {
    broadcast(simulationId, {
      type: 'agent_complete',
      payload: { simulationId, agentId: data.result.agentId, result: data.result },
    });
  });

  orchestrator.on('organism:update', (data: { simulationId: string; organismState: OrganismState }) => {
    broadcast(simulationId, {
      type: 'organism_update',
      payload: { simulationId, state: data.organismState },
    });
  });

  orchestrator.on('round:complete', (data: { simulationId: string; round: number; consensus: unknown; organismState: OrganismState }) => {
    const sim = getSimulation(simulationId);
    const round = sim?.rounds[sim.rounds.length - 1];
    if (round) {
      broadcast(simulationId, {
        type: 'round_complete',
        payload: { simulationId, round },
      });
    }
  });

  orchestrator.on('simulation:complete', () => {
    const sim = getSimulation(simulationId);
    broadcast(simulationId, {
      type: 'simulation_complete',
      payload: { simulationId, finalState: sim?.organismState ?? ({} as OrganismState) },
    });
    activeOrchestrators.delete(simulationId);
  });

  orchestrator.on('error', (data: { simulationId: string; error: string }) => {
    broadcast(simulationId, {
      type: 'error',
      payload: { simulationId, message: data.error, code: 'ORCHESTRATOR_ERROR' },
    });
  });

  // Run the simulation
  orchestrator.run(simulationId).catch((err) => {
    broadcast(simulationId, {
      type: 'error',
      payload: { simulationId, message: String(err), code: 'RUN_ERROR' },
    });
  });
}

async function handleSummaryRequest(ws: WebSocket, simulationId: string) {
  try {
    const { callClaude } = require('@/lib/anthropic');
    const sim = getSimulation(simulationId);
    if (!sim || sim.rounds.length === 0) {
      sendToClient(ws, {
        type: 'error',
        payload: { simulationId, message: 'No rounds to summarize', code: 'NO_DATA' },
      });
      return;
    }

    const latestRound = sim.rounds[sim.rounds.length - 1];
    const systemPrompt = 'You are an executive briefing generator. Be direct, specific, and actionable.';
    const userPrompt = `Generate an executive briefing for ${sim.companyName}.\n\nOverall Health: ${latestRound.consensus.overallHealth}/100\nScores: ${JSON.stringify(latestRound.consensus.dimensionScores)}\nTop Risks: ${JSON.stringify(latestRound.consensus.topRisks.slice(0, 3))}\nTop Opportunities: ${JSON.stringify(latestRound.consensus.topOpportunities.slice(0, 3))}`;

    const summary = await callClaude(systemPrompt, userPrompt);
    sendToClient(ws, {
      type: 'summary_ready',
      payload: { simulationId, summary },
    });
  } catch (err) {
    sendToClient(ws, {
      type: 'error',
      payload: { simulationId, message: String(err), code: 'SUMMARY_ERROR' },
    });
  }
}

function subscribeClient(ws: WebSocket, simulationId: string) {
  const subs = clientSubscriptions.get(ws);
  if (subs) {
    subs.add(simulationId);
  }
}

function sendToClient(ws: WebSocket, message: ServerMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

function broadcast(simulationId: string, message: ServerMessage) {
  for (const [ws, subs] of clientSubscriptions) {
    if (subs.has(simulationId)) {
      sendToClient(ws, message);
    }
  }
}
