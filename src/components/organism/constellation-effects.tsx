'use client';

import { EffectComposer, Bloom } from '@react-three/postprocessing';

export function ConstellationEffects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  );
}
