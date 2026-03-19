import { getSimulation, createSimulation } from '@/lib/simulation-store';
import { SimulationOrchestrator } from '@/engine/orchestrator';
import type { AgentResult, AgentRole, SimulationConfig } from '@/types/simulation';
import type { OrganismState } from '@/types/organism';

// Track active orchestrators so inject/pause can reach them
const activeOrchestrators = new Map<string, SimulationOrchestrator>();

export function getOrchestrator(id: string) {
  return activeOrchestrators.get(id);
}

const DEFAULT_CONFIG: SimulationConfig = {
  agentCount: 6,
  roundCount: 1,
  model: 'gemini-2.0-flash',
  enabledRoles: [
    'market_analyst',
    'financial_analyst',
    'geopolitical_risk',
    'supply_chain',
    'talent_culture',
    'technology',
  ] as AgentRole[],
};

export const maxDuration = 60; // Vercel Hobby: 60s max

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let simulation = getSimulation(id);

  // On serverless platforms, the in-memory store may not persist between
  // the POST that created the simulation and this GET request.
  // Re-create from query params if needed.
  if (!simulation) {
    const url = new URL(request.url);
    const companyName = url.searchParams.get('companyName');
    const context = url.searchParams.get('context') || '';
    if (companyName) {
      simulation = createSimulation(id, companyName, context, DEFAULT_CONFIG);
    }
  }

  if (!simulation) {
    return new Response(JSON.stringify({ error: 'Simulation not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          // Stream may be closed
        }
      }

      // Check for API key before starting
      if (!process.env.GEMINI_API_KEY) {
        send('simulation_created', {
          simulationId: id,
          config: simulation.config,
        });
        send('error', {
          simulationId: id,
          message: 'GEMINI_API_KEY is not set. Add it in Vercel → Settings → Environment Variables, then redeploy.',
          code: 'MISSING_API_KEY',
        });
        controller.close();
        return;
      }

      // Send initial simulation state
      send('simulation_created', {
        simulationId: id,
        config: simulation.config,
      });

      // If already completed, send current state and close
      if (simulation.status === 'completed' || simulation.status === 'error') {
        send('simulation_state', {
          simulationId: id,
          status: simulation.status,
          organismState: simulation.organismState,
          rounds: simulation.rounds,
        });
        controller.close();
        return;
      }

      // Start orchestrator
      const orchestrator = new SimulationOrchestrator();
      activeOrchestrators.set(id, orchestrator);

      orchestrator.on('agent:started', (data: { simulationId: string; role: string }) => {
        send('agent_started', {
          simulationId: id,
          agentId: data.role,
          role: data.role as AgentRole,
        });
      });

      orchestrator.on('agent:complete', (data: { simulationId: string; result: AgentResult }) => {
        send('agent_complete', {
          simulationId: id,
          agentId: data.result.agentId,
          result: data.result,
        });
      });

      orchestrator.on('organism:update', (data: { simulationId: string; organismState: OrganismState }) => {
        send('organism_update', {
          simulationId: id,
          state: data.organismState,
        });
      });

      orchestrator.on('round:complete', (data: { simulationId: string; round: number; consensus: unknown; organismState: OrganismState }) => {
        const sim = getSimulation(id);
        const round = sim?.rounds[sim.rounds.length - 1];
        if (round) {
          send('round_complete', { simulationId: id, round });
        }
      });

      orchestrator.on('simulation:complete', () => {
        const sim = getSimulation(id);
        send('simulation_complete', {
          simulationId: id,
          finalState: sim?.organismState,
        });
        activeOrchestrators.delete(id);
        controller.close();
      });

      orchestrator.on('error', (data: { simulationId: string; error: string }) => {
        send('error', {
          simulationId: id,
          message: data.error,
          code: 'ORCHESTRATOR_ERROR',
        });
      });

      try {
        await orchestrator.run(id);
      } catch (err) {
        send('error', {
          simulationId: id,
          message: String(err),
          code: 'RUN_ERROR',
        });
        activeOrchestrators.delete(id);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
