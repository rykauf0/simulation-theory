'use client';

import { create } from 'zustand';
import type { AgentResult, AgentRole, SimulationRound, SimulationStatus, DimensionScores } from '@/types/simulation';
import type { OrganismState } from '@/types/organism';
import { DEFAULT_ORGANISM_STATE } from '@/types/organism';

interface AgentStatus {
  agentId: string;
  role: AgentRole;
  status: 'pending' | 'running' | 'complete' | 'error';
  partialAnalysis?: string;
  result?: AgentResult;
}

interface SimulationStore {
  // Simulation metadata
  simulationId: string | null;
  companyName: string;
  context: string;
  status: SimulationStatus;

  // Agent tracking
  agents: AgentStatus[];
  currentRound: number;
  totalRounds: number;

  // Results
  rounds: SimulationRound[];
  latestScores: DimensionScores | null;
  latestConsensus: string;

  // Organism state (target for 3D interpolation)
  organismState: OrganismState;

  // UI state
  selectedRound: number | null;
  showSummary: boolean;
  summaryText: string;
  logEntries: LogEntry[];

  // Actions
  setSimulation: (id: string, company: string, context: string) => void;
  setStatus: (status: SimulationStatus) => void;
  setAgents: (agents: AgentStatus[]) => void;
  updateAgent: (agentId: string, update: Partial<AgentStatus>) => void;
  addRound: (round: SimulationRound) => void;
  setOrganismState: (state: OrganismState) => void;
  setSelectedRound: (round: number | null) => void;
  setSummary: (text: string) => void;
  toggleSummary: () => void;
  addLogEntry: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  reset: () => void;
}

export interface LogEntry {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  timestamp: number;
}

let logCounter = 0;

export const useSimulationStore = create<SimulationStore>((set) => ({
  simulationId: null,
  companyName: '',
  context: '',
  status: 'initializing',
  agents: [],
  currentRound: 0,
  totalRounds: 1,
  rounds: [],
  latestScores: null,
  latestConsensus: '',
  organismState: DEFAULT_ORGANISM_STATE,
  selectedRound: null,
  showSummary: false,
  summaryText: '',
  logEntries: [],

  setSimulation: (id, company, context) =>
    set({ simulationId: id, companyName: company, context, status: 'initializing' }),

  setStatus: (status) => set({ status }),

  setAgents: (agents) => set({ agents }),

  updateAgent: (agentId, update) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.agentId === agentId ? { ...a, ...update } : a
      ),
    })),

  addRound: (round) =>
    set((state) => ({
      rounds: [...state.rounds, round],
      currentRound: round.roundNumber,
      latestScores: round.consensus.dimensionScores,
      latestConsensus: round.consensus.narrativeSummary,
    })),

  setOrganismState: (organismState) => set({ organismState }),

  setSelectedRound: (selectedRound) => set({ selectedRound }),

  setSummary: (summaryText) => set({ summaryText, showSummary: true }),

  toggleSummary: () => set((state) => ({ showSummary: !state.showSummary })),

  addLogEntry: (entry) =>
    set((state) => ({
      logEntries: [
        ...state.logEntries,
        { ...entry, id: `log-${++logCounter}`, timestamp: Date.now() },
      ].slice(-200), // Keep last 200 entries
    })),

  reset: () =>
    set({
      simulationId: null,
      companyName: '',
      context: '',
      status: 'initializing',
      agents: [],
      currentRound: 0,
      rounds: [],
      latestScores: null,
      latestConsensus: '',
      organismState: DEFAULT_ORGANISM_STATE,
      selectedRound: null,
      showSummary: false,
      summaryText: '',
      logEntries: [],
    }),
}));
