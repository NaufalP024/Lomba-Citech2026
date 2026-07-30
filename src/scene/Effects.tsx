import React from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export const Effects: React.FC = () => {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        luminanceThreshold={0.85}
        luminanceSmoothing={0.7}
        intensity={0.4}
      />
    </EffectComposer>
  );
};
