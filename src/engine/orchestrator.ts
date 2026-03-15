import { EventEmitter } from 'events';
import { AgentPool } from './agent-pool';
import { executeAgent } from './agent';
import { aggregateResults, deriveOrganismState } from './aggregator';
import {
  getSimulation,
  updateSimulation,
} from '@/lib/simulation-store';
import type {
  AgentResult,
  AgentRole,
  ConsensusResult,
  SimulationRound,
} from '@/types/simulation';

export class SimulationOrchestrator extends EventEmitter {
  private pool: AgentPool;
  private paused: boolean = false;
  private pausePromiseResolve: (() => void) | null = null;
  private injectedEvents: string[] = [];

  constructor(maxConcurrent: number = 5) {
    super();
    this.pool = new AgentPool(maxConcurrent);
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
    if (this.pausePromiseResolve) {
      this.pausePromiseResolve();
      this.pausePromiseResolve = null;
    }
  }

  injectEvent(event: string): void {
    this.injectedEvents.push(event);
  }

  private async waitIfPaused(): Promise<void> {
    if (!this.paused) return;
    return new Promise<void>((resolve) => {
      this.pausePromiseResolve = resolve;
    });
  }

  async run(simulationId: string): Promise<void> {
    const simulation = getSimulation(simulationId);
    if (!simulation) {
      this.emit('error', { simulationId, error: 'Simulation not found' });
      return;
    }

    updateSimulation(simulationId, { status: 'running' });

    const { config, companyName, context } = simulation;
    const { roundCount, enabledRoles } = config;

    let previousConsensus: ConsensusResult | undefined;

    try {
      for (let round = 0; round < roundCount; round++) {
        await this.waitIfPaused();

        updateSimulation(simulationId, { currentRound: round + 1 });

        // Build agent tasks for this round
        const tasks = enabledRoles.map((role: AgentRole) => {
          return () => {
            this.emit('agent:started', {
              simulationId,
              round: round + 1,
              role,
            });
            return executeAgent(role, companyName, context, previousConsensus);
          };
        });

        const completedResults: AgentResult[] = [];

        // Execute all agents through the pool
        const results = await this.pool.executeAll(
          tasks,
          (result: AgentResult) => {
            completedResults.push(result);

            this.emit('agent:complete', {
              simulationId,
              round: round + 1,
              result,
            });

            // Partial organism state from completed results so far
            const partialConsensus = aggregateResults(completedResults);
            const partialOrganism = deriveOrganismState(partialConsensus);

            this.emit('agent:progress', {
              simulationId,
              round: round + 1,
              completedCount: completedResults.length,
              totalCount: enabledRoles.length,
            });

            this.emit('organism:update', {
              simulationId,
              organismState: partialOrganism,
            });

            updateSimulation(simulationId, {
              organismState: partialOrganism,
            });
          }
        );

        // Aggregate full round results
        const consensus = aggregateResults(results);
        const organismState = deriveOrganismState(consensus);
        previousConsensus = consensus;

        const roundData: SimulationRound = {
          roundNumber: round + 1,
          agentResults: results,
          consensus,
          timestamp: Date.now(),
        };

        // Update simulation store
        const currentSim = getSimulation(simulationId);
        if (currentSim) {
          const updatedRounds = [...currentSim.rounds, roundData];
          updateSimulation(simulationId, {
            rounds: updatedRounds,
            organismState,
          });
        }

        this.emit('round:complete', {
          simulationId,
          round: round + 1,
          consensus,
          organismState,
        });
      }

      updateSimulation(simulationId, { status: 'completed' });
      this.emit('simulation:complete', { simulationId });
    } catch (error) {
      updateSimulation(simulationId, { status: 'error' });
      this.emit('error', {
        simulationId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
