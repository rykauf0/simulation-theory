import type { AgentResult, AgentRole, SimulationConfig, SimulationRound } from './simulation';
import type { OrganismState } from './organism';

// Client → Server
export type ClientMessage =
  | { type: 'start_simulation'; payload: { companyName: string; context: string; config?: Partial<SimulationConfig> } }
  | { type: 'pause_simulation'; payload: { simulationId: string } }
  | { type: 'resume_simulation'; payload: { simulationId: string } }
  | { type: 'inject_event'; payload: { simulationId: string; event: string } }
  | { type: 'request_summary'; payload: { simulationId: string; roundNumber?: number } }
  | { type: 'subscribe'; payload: { simulationId: string } };

// Server → Client
export type ServerMessage =
  | { type: 'simulation_created'; payload: { simulationId: string; config: SimulationConfig } }
  | { type: 'agent_started'; payload: { simulationId: string; agentId: string; role: AgentRole } }
  | { type: 'agent_progress'; payload: { simulationId: string; agentId: string; partialAnalysis: string } }
  | { type: 'agent_complete'; payload: { simulationId: string; agentId: string; result: AgentResult } }
  | { type: 'round_complete'; payload: { simulationId: string; round: SimulationRound } }
  | { type: 'organism_update'; payload: { simulationId: string; state: OrganismState } }
  | { type: 'simulation_complete'; payload: { simulationId: string; finalState: OrganismState } }
  | { type: 'summary_ready'; payload: { simulationId: string; summary: string } }
  | { type: 'error'; payload: { simulationId?: string; message: string; code: string } };
