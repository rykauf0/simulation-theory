'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ConstellationNetwork } from './constellation-network';
import { ConstellationParticles } from './constellation-particles';
import { ConstellationEffects } from './constellation-effects';

export function OrganismCanvas() {
  return (
    <Canvas
      gl={{ antialias: true }}
      style={{ background: '#000000' }}
    >
      <color attach="background" args={['#000000']} />

      <PerspectiveCamera makeDefault position={[0, 0, 8]} />

      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#00ff41" />

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.4}
        enableDamping
        dampingFactor={0.05}
      />

      <Suspense fallback={null}>
        <ConstellationNetwork />
        <ConstellationParticles />
        <ConstellationEffects />
      </Suspense>
    </Canvas>
  );
}
