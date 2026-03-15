'use client';

import { useSimulationStore } from '@/stores/simulation-store';
import { useOrganismInterpolation } from '@/hooks/use-organism-state';
import { ConstellationNode } from './constellation-node';
import { ConstellationEdge } from './constellation-edge';

const HUB_POSITION: [number, number, number] = [0, 0, 0];

export function ConstellationNetwork() {
  const organs = useSimulationStore((s) => s.organismState.organs);
  const { interpolated } = useOrganismInterpolation();

  return (
    <group>
      {/* Central hub node */}
      <ConstellationNode
        position={HUB_POSITION}
        health={interpolated.current.health}
        size={1}
        activity={interpolated.current.pulseIntensity}
        label="Hub"
        isHub
      />

      {/* Dimension nodes */}
      {organs.map((organ, i) => (
        <ConstellationNode
          key={organ.id}
          position={organ.position}
          health={interpolated.current.organHealths[i] ?? organ.health}
          size={interpolated.current.organSizes[i] ?? organ.size}
          activity={interpolated.current.organActivities[i] ?? organ.activity}
          label={organ.label}
        />
      ))}

      {/* Edges from hub to each dimension node */}
      {organs.map((organ, i) => (
        <ConstellationEdge
          key={`edge-${organ.id}`}
          start={HUB_POSITION}
          end={organ.position}
          health={interpolated.current.organHealths[i] ?? organ.health}
          agreement={interpolated.current.agreement}
        />
      ))}
    </group>
  );
}
