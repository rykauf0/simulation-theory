'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { ClientMessage, ServerMessage } from '@/types/ws-messages';
import { useSimulationStore } from '@/stores/simulation-store';

export function useSimulationWs() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const {
    setSimulation,
    setStatus,
    setAgents,
    updateAgent,
    addRound,
    setOrganismState,
    setSummary,
    addLogEntry,
  } = useSimulationStore();

  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttempts.current = 0;
      addLogEntry({ text: 'Connected to simulation server', type: 'system' });
    };

    ws.onclose = () => {
      addLogEntry({ text: 'Disconnected from server', type: 'warning' });
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.pow(2, reconnectAttempts.current) * 1000;
        reconnectAttempts.current++;
        setTimeout(connect, delay);
      }
    };

    ws.onerror = () => {
      addLogEntry({ text: 'WebSocket error', type: 'error' });
    };

    ws.onmessage = (event) => {
      const message: ServerMessage = JSON.parse(event.data);
      handleMessage(message);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMessage = useCallback((message: ServerMessage) => {
    switch (message.type) {
      case 'simulation_created': {
        const { simulationId, config } = message.payload;
        addLogEntry({ text: `Simulation ${simulationId.slice(0, 8)} initialized`, type: 'system' });
        setAgents(
          config.enabledRoles.map((role) => ({
            agentId: '',
            role,
            status: 'pending' as const,
          }))
        );
        setStatus('running');
        break;
      }

      case 'agent_started': {
        const { agentId, role } = message.payload;
        updateAgent(agentId, { agentId, role, status: 'running' });
        addLogEntry({
          text: `[${role.toUpperCase().replace('_', ' ')}] Agent initialized, analyzing...`,
          type: 'info',
        });
        break;
      }

      case 'agent_progress': {
        const { agentId, partialAnalysis } = message.payload;
        updateAgent(agentId, { partialAnalysis });
        break;
      }

      case 'agent_complete': {
        const { agentId, result } = message.payload;
        updateAgent(agentId, { status: 'complete', result });
        const healthPct = Math.round(
          Object.values(result.scores).reduce((a, b) => a + b, 0) / 6
        );
        addLogEntry({
          text: `[${result.role.toUpperCase().replace('_', ' ')}] Analysis complete — health: ${healthPct}/100, confidence: ${(result.confidence * 100).toFixed(0)}%`,
          type: 'success',
        });
        break;
      }

      case 'organism_update': {
        setOrganismState(message.payload.state);
        break;
      }

      case 'round_complete': {
        const { round } = message.payload;
        addRound(round);
        addLogEntry({
          text: `[CONSENSUS] Round ${round.roundNumber} complete — overall health: ${round.consensus.overallHealth}/100, agreement: ${(round.consensus.agreement * 100).toFixed(0)}%`,
          type: 'system',
        });
        break;
      }

      case 'simulation_complete': {
        setStatus('completed');
        setOrganismState(message.payload.finalState);
        addLogEntry({ text: 'Simulation complete', type: 'system' });
        break;
      }

      case 'summary_ready': {
        setSummary(message.payload.summary);
        addLogEntry({ text: 'Executive briefing generated', type: 'info' });
        break;
      }

      case 'error': {
        addLogEntry({ text: `Error: ${message.payload.message}`, type: 'error' });
        break;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = useCallback((message: ClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const startSimulation = useCallback(
    (companyName: string, context: string) => {
      setSimulation('pending', companyName, context);
      addLogEntry({ text: `Initializing simulation for "${companyName}"...`, type: 'system' });
      send({
        type: 'start_simulation',
        payload: { companyName, context },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [send]
  );

  const injectEvent = useCallback(
    (simulationId: string, event: string) => {
      addLogEntry({ text: `Injecting event: "${event}"`, type: 'warning' });
      send({
        type: 'inject_event',
        payload: { simulationId, event },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [send]
  );

  const requestSummary = useCallback(
    (simulationId: string) => {
      addLogEntry({ text: 'Generating executive briefing...', type: 'info' });
      send({
        type: 'request_summary',
        payload: { simulationId },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [send]
  );

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  return { send, startSimulation, injectEvent, requestSummary };
}
