import type { Simulation, SimulationConfig } from '@/types/simulation';
import { DEFAULT_ORGANISM_STATE } from '@/types/organism';

const store = new Map<string, Simulation>();

export function createSimulation(
  id: string,
  companyName: string,
  context: string,
  config: SimulationConfig
): Simulation {
  const simulation: Simulation = {
    id,
    companyName,
    context,
    status: 'initializing',
    createdAt: Date.now(),
    config,
    rounds: [],
    currentRound: 0,
    organismState: { ...DEFAULT_ORGANISM_STATE, organs: DEFAULT_ORGANISM_STATE.organs.map((o) => ({ ...o, position: [...o.position] as [number, number, number] })) },
  };

  store.set(id, simulation);
  return simulation;
}

export function getSimulation(id: string): Simulation | undefined {
  return store.get(id);
}

export function updateSimulation(
  id: string,
  partial: Partial<Simulation>
): void {
  const existing = store.get(id);
  if (!existing) {
    throw new Error(`Simulation ${id} not found`);
  }
  store.set(id, { ...existing, ...partial });
}

export function deleteSimulation(id: string): void {
  store.delete(id);
}

export function listSimulations(): Simulation[] {
  return Array.from(store.values());
}
