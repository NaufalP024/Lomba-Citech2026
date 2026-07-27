import React from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useCityStore } from '../store/useCityStore';

export const Effects: React.FC = () => {
  const isNightMode = useCityStore((state) => state.isNightMode);

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={isNightMode ? 0.45 : 0.85}
        luminanceSmoothing={0.7}
        intensity={isNightMode ? 1.2 : 0.45}
        mipmapBlur
      />
    </EffectComposer>
  );
};
