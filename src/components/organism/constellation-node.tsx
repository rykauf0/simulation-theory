'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ConstellationNodeProps {
  position: [number, number, number];
  health: number;
  size: number;
  activity: number;
  label: string;
  isHub?: boolean;
}

/**
 * Interpolates health (0-1) to a color:
 *   1.0 = green (#00ff41)
 *   0.5 = yellow (#ffb700)
 *   0.0 = red (#ff0040)
 */
function healthToColor(health: number, target: THREE.Color): void {
  const green = new THREE.Color('#00ff41');
  const yellow = new THREE.Color('#ffb700');
  const red = new THREE.Color('#ff0040');

  if (health >= 0.5) {
    const t = (health - 0.5) * 2; // 0-1 over the top half
    target.copy(yellow).lerp(green, t);
  } else {
    const t = health * 2; // 0-1 over the bottom half
    target.copy(red).lerp(yellow, t);
  }
}

export function ConstellationNode({
  position,
  health,
  size,
  activity,
  label,
  isHub = false,
}: ConstellationNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const baseScale = isHub ? 0.8 : 0.3 + size * 0.2;
  const colorObj = useMemo(() => new THREE.Color(), []);
  const emissiveObj = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const t = state.clock.elapsedTime;

    // Breathing / pulse animation
    const pulseSpeed = isHub ? 1.5 : 2.0;
    const pulseAmount = activity > 0.5 ? 0.15 : 0.05;
    const scale = baseScale + Math.sin(t * pulseSpeed) * pulseAmount * baseScale;
    meshRef.current.scale.setScalar(scale);

    // Slow rotation
    meshRef.current.rotation.y += 0.003;
    if (isHub) {
      meshRef.current.rotation.x += 0.001;
    }

    // Update color from health
    healthToColor(health, colorObj);
    materialRef.current.color.copy(colorObj);

    // Emissive glow proportional to activity
    healthToColor(health, emissiveObj);
    emissiveObj.multiplyScalar(0.3 + activity * 0.7);
    materialRef.current.emissive.copy(emissiveObj);
    materialRef.current.emissiveIntensity = 0.5 + activity * 1.5;
  });

  return (
    <mesh ref={meshRef} position={position}>
      {isHub ? (
        <icosahedronGeometry args={[1, 1]} />
      ) : (
        <sphereGeometry args={[1, 16, 16]} />
      )}
      <meshStandardMaterial
        ref={materialRef}
        color="#00ff41"
        emissive="#00ff41"
        emissiveIntensity={0.8}
        roughness={0.3}
        metalness={0.6}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}
