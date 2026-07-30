import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Lights: React.FC = () => {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (!dirLightRef.current) return;
    const t = state.clock.getElapsedTime() * 0.05;
    dirLightRef.current.position.x = 25 + Math.sin(t) * 3;
    dirLightRef.current.position.z = 30 + Math.cos(t) * 3;
  });

  return (
    <>
      {/* Primary Sunlight */}
      <directionalLight
        ref={dirLightRef}
        position={[30, 45, 35]}
        intensity={1.4}
        color="#FFFDF5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0001}
      />

      {/* Ambient Fill */}
      <ambientLight intensity={0.65} color="#EDF4FC" />

      {/* Hemisphere sky/ground light */}
      <hemisphereLight args={['#E0ECFB', '#C7D2FE', 0.7]} />

      {/* Secondary accent directional light */}
      <directionalLight
        position={[-30, 20, -30]}
        intensity={0.4}
        color="#E2E8F0"
      />
    </>
  );
};
