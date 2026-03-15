'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface ConstellationEdgeProps {
  start: [number, number, number];
  end: [number, number, number];
  health: number;
  agreement: number;
}

function healthToColor(health: number): THREE.Color {
  const green = new THREE.Color('#00ff41');
  const yellow = new THREE.Color('#ffb700');
  const red = new THREE.Color('#ff0040');

  if (health >= 0.5) {
    const t = (health - 0.5) * 2;
    return yellow.clone().lerp(green, t);
  } else {
    const t = health * 2;
    return red.clone().lerp(yellow, t);
  }
}

export function ConstellationEdge({
  start,
  end,
  health,
  agreement,
}: ConstellationEdgeProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineRef = useRef<any>(null);
  const widthRef = useRef(1);

  const color = useMemo(() => healthToColor(health), [health]);
  const points = useMemo(
    () => [new THREE.Vector3(...start), new THREE.Vector3(...end)],
    [start, end]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Subtle pulse on line width
    widthRef.current = 1.0 + Math.sin(t * 2) * 0.3;

    if (lineRef.current) {
      const mat = lineRef.current.material;
      if (mat) {
        mat.linewidth = widthRef.current;
        mat.opacity = 0.2 + agreement * 0.8;
      }
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.2 + agreement * 0.8}
    />
  );
}
