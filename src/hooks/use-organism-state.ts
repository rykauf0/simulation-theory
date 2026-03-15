'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSimulationStore } from '@/stores/simulation-store';

function lerpValue(current: number, target: number, speed: number): number {
  return current + (target - current) * speed;
}

/**
 * Provides smoothly interpolated organism state for 3D rendering.
 * The store holds "target" values; this hook lerps toward them each frame.
 */
export function useOrganismInterpolation() {
  const targetState = useSimulationStore((s) => s.organismState);

  const interpolated = useRef({
    health: targetState.health,
    pulseRate: targetState.pulseRate,
    pulseIntensity: targetState.pulseIntensity,
    volatility: targetState.volatility,
    momentum: targetState.momentum,
    agreement: targetState.agreement,
    organHealths: targetState.organs.map((o) => o.health),
    organSizes: targetState.organs.map((o) => o.size),
    organActivities: targetState.organs.map((o) => o.activity),
  });

  useFrame((_, delta) => {
    const speed = Math.min(delta * 3, 1); // ~3x per second convergence rate

    const ref = interpolated.current;
    ref.health = lerpValue(ref.health, targetState.health, speed);
    ref.pulseRate = lerpValue(ref.pulseRate, targetState.pulseRate, speed);
    ref.pulseIntensity = lerpValue(ref.pulseIntensity, targetState.pulseIntensity, speed);
    ref.volatility = lerpValue(ref.volatility, targetState.volatility, speed);
    ref.momentum = lerpValue(ref.momentum, targetState.momentum, speed);
    ref.agreement = lerpValue(ref.agreement, targetState.agreement, speed);

    targetState.organs.forEach((organ, i) => {
      ref.organHealths[i] = lerpValue(ref.organHealths[i] ?? 0.5, organ.health, speed);
      ref.organSizes[i] = lerpValue(ref.organSizes[i] ?? 1, organ.size, speed);
      ref.organActivities[i] = lerpValue(ref.organActivities[i] ?? 0, organ.activity, speed);
    });
  });

  return { interpolated, targetState };
}
