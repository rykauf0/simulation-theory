import type { SimulationConfig } from './simulation';

export interface CreateSimulationRequest {
  companyName: string;
  context: string;
  config?: Partial<SimulationConfig>;
}

export interface CreateSimulationResponse {
  simulationId: string;
  config: SimulationConfig;
}

export interface SimulationSummaryRequest {
  roundNumber?: number;
}

export interface InjectEventRequest {
  event: string;
}
