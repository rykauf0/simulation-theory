import type { OrganismState } from './organism';

export type SimulationStatus = 'initializing' | 'running' | 'paused' | 'completed' | 'error';

export interface Simulation {
  id: string;
  companyName: string;
  context: string;
  status: SimulationStatus;
  createdAt: number;
  config: SimulationConfig;
  rounds: SimulationRound[];
  currentRound: number;
  organismState: OrganismState;
}

export interface SimulationConfig {
  agentCount: number;
  roundCount: number;
  model: string;
  enabledRoles: AgentRole[];
}

export type AgentRole =
  | 'market_analyst'
  | 'financial_analyst'
  | 'geopolitical_risk'
  | 'supply_chain'
  | 'talent_culture'
  | 'technology';

export interface AgentDefinition {
  role: AgentRole;
  label: string;
  systemPrompt: string;
  focusAreas: string[];
}

export interface AgentResult {
  agentId: string;
  role: AgentRole;
  status: 'pending' | 'running' | 'complete' | 'error';
  scores: DimensionScores;
  analysis: string;
  risks: Risk[];
  opportunities: Opportunity[];
  keyMetrics: string[];
  confidence: number;
  timestamp: number;
  durationMs: number;
}

export interface DimensionScores {
  financial: number;
  market: number;
  reputation: number;
  operational: number;
  innovation: number;
  resilience: number;
}

export type DimensionKey = keyof DimensionScores;

export interface Risk {
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  dimension: DimensionKey;
  estimatedImpact?: string;
  mitigation?: string;
}

export interface Opportunity {
  description: string;
  impact: 'low' | 'medium' | 'high';
  dimension: DimensionKey;
  recommendedAction?: string;
  priority?: number;
}

export interface SimulationRound {
  roundNumber: number;
  agentResults: AgentResult[];
  consensus: ConsensusResult;
  timestamp: number;
}

export interface ConsensusResult {
  overallHealth: number;
  dimensionScores: DimensionScores;
  agreement: number;
  topRisks: Risk[];
  topOpportunities: Opportunity[];
  divergentViews: DivergentView[];
  narrativeSummary: string;
  actionPlan: string[];
}

export interface DivergentView {
  dimension: DimensionKey;
  agentRole: AgentRole;
  deviation: number;
  reasoning: string;
}

// Re-export organism types for convenience
export type { OrganismState, OrganState } from './organism';
