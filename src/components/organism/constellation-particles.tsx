'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useOrganismInterpolation } from '@/hooks/use-organism-state';

const MAX_PARTICLES = 500;

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

export function ConstellationParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const { interpolated } = useOrganismInterpolation();

  // Pre-allocate max particle positions and initial orbital data
  const { positions, orbital: orbitalData } = useMemo(() => {
    const pos = new Float32Array(MAX_PARTICLES * 3);
    const orbital = new Array(MAX_PARTICLES);

    for (let i = 0; i < MAX_PARTICLES; i++) {
      // Random spherical distribution
      const radius = 2 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      orbital[i] = {
        radius,
        theta,
        phi,
        speed: 0.05 + Math.random() * 0.15,
        drift: (Math.random() - 0.5) * 0.02,
      };
    }

    return { positions: pos, orbital };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const materialRef = useRef<THREE.PointsMaterial>(null);

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return;

    const t = state.clock.elapsedTime;
    const volatility = interpolated.current.volatility;
    const health = interpolated.current.health;

    // Number of visible particles scales with volatility (50-500)
    const activeCount = Math.floor(50 + volatility * 450);

    // Update positions for orbital motion
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const orb = orbitalData[i];

      if (i < activeCount) {
        // Animate orbit
        orb.theta += orb.speed * 0.01;
        orb.phi += orb.drift * 0.01;

        const r = orb.radius + Math.sin(t * orb.speed + i) * 0.3;
        posAttr.setXYZ(
          i,
          r * Math.sin(orb.phi) * Math.cos(orb.theta),
          r * Math.sin(orb.phi) * Math.sin(orb.theta),
          r * Math.cos(orb.phi)
        );
      } else {
        // Hide inactive particles far away
        posAttr.setXYZ(i, 0, 0, -1000);
      }
    }
    posAttr.needsUpdate = true;

    // Update material color based on health
    const color = healthToColor(health);
    materialRef.current.color.copy(color);
    materialRef.current.opacity = 0.3 + volatility * 0.4;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        size={0.03}
        color="#00ff41"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
