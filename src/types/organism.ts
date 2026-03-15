export interface OrganismState {
  health: number;           // 0-1, overall health drives hub color
  pulseRate: number;        // breathing speed: slow=calm, fast=stressed
  pulseIntensity: number;   // how dramatic the pulse
  volatility: number;       // particle emission rate
  momentum: number;         // -1 to 1, expansion vs contraction
  agreement: number;        // 0-1, consensus smoothness
  organs: OrganState[];
}

export interface OrganState {
  id: string;
  dimension: string;
  label: string;
  health: number;           // 0-1
  size: number;             // relative size based on score
  activity: number;         // 0-1, glow intensity
  position: [number, number, number];
}

export const DEFAULT_ORGANISM_STATE: OrganismState = {
  health: 0.5,
  pulseRate: 1.0,
  pulseIntensity: 0.3,
  volatility: 0.2,
  momentum: 0,
  agreement: 0.5,
  organs: [
    { id: 'financial', dimension: 'financial', label: 'Financial', health: 0.5, size: 1, activity: 0, position: [2, 1, 0] },
    { id: 'market', dimension: 'market', label: 'Market', health: 0.5, size: 1, activity: 0, position: [-2, 1, 0] },
    { id: 'reputation', dimension: 'reputation', label: 'Reputation', health: 0.5, size: 1, activity: 0, position: [0, 2, 1] },
    { id: 'operational', dimension: 'operational', label: 'Operational', health: 0.5, size: 1, activity: 0, position: [0, -2, 1] },
    { id: 'innovation', dimension: 'innovation', label: 'Innovation', health: 0.5, size: 1, activity: 0, position: [1.5, 0, 2] },
    { id: 'resilience', dimension: 'resilience', label: 'Resilience', health: 0.5, size: 1, activity: 0, position: [-1.5, 0, 2] },
  ],
};
