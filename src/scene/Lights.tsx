import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../store/useCityStore';

export const Lights: React.FC = () => {
  const isNightMode = useCityStore((state) => state.isNightMode);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (!dirLightRef.current) return;
    // Subtle ambient shift in sunlight over time
    const t = state.clock.getElapsedTime() * 0.05;
    if (!isNightMode) {
      dirLightRef.current.position.x = 25 + Math.sin(t) * 3;
      dirLightRef.current.position.z = 30 + Math.cos(t) * 3;
    }
  });

  return (
    <>
      {/* Primary Sunlight / MoonLight */}
      <directionalLight
        ref={dirLightRef}
        position={isNightMode ? [-15, 30, -20] : [30, 45, 35]}
        intensity={isNightMode ? 0.35 : 1.4}
        color={isNightMode ? '#60A5FA' : '#FFFDF5'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0001}
      />

      {/* Ambient Fill */}
      <ambientLight
        intensity={isNightMode ? 0.25 : 0.65}
        color={isNightMode ? '#1E293B' : '#EDF4FC'}
      />

      {/* Hemisphere sky/ground light for realistic soft ambient shading */}
      <hemisphereLight
        args={[
          isNightMode ? '#1E3A8A' : '#E0ECFB',
          isNightMode ? '#020617' : '#C7D2FE',
          isNightMode ? 0.4 : 0.7,
        ]}
      />

      {/* Secondary accent directional light */}
      <directionalLight
        position={[-30, 20, -30]}
        intensity={isNightMode ? 0.2 : 0.4}
        color={isNightMode ? '#00D8FF' : '#E2E8F0'}
      />
    </>
  );
};
