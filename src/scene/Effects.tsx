import React from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useCityStore } from '../store/useCityStore';

export const Effects: React.FC = () => {
  const isNightMode = useCityStore((state) => state.isNightMode);

  return (
    <EffectComposer multisampling={4}>
      <Bloom
        luminanceThreshold={isNightMode ? 0.4 : 0.82}
        luminanceSmoothing={0.65}
        intensity={isNightMode ? 1.4 : 0.55}
      />
    </EffectComposer>
  );
};
