import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../store/useCityStore';

export const EnvironmentSky: React.FC = () => {
  const isNightMode = useCityStore((state) => state.isNightMode);
  const cloudGroupRef = useRef<THREE.Group>(null);
  const particleGroupRef = useRef<THREE.Points>(null);

  // Generate random clouds positions
  const cloudPositions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) {
      arr.push([
        (Math.random() - 0.5) * 80,
        18 + Math.random() * 8,
        (Math.random() - 0.5) * 80,
      ]);
    }
    return arr;
  }, []);

  // Generate floating dust / ambient light particles
  const particles = useMemo(() => {
    const count = 60;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = 2 + Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (cloudGroupRef.current) {
      cloudGroupRef.current.rotation.y += delta * 0.015;
    }
    if (particleGroupRef.current) {
      particleGroupRef.current.rotation.y -= delta * 0.008;
    }
  });

  return (
    <>
      {/* Background color matching PRD spec #EEF3F8 for day, #080E1E for night */}
      <color attach="background" args={[isNightMode ? '#080E1E' : '#EEF3F8']} />

      {/* Atmospheric Fog */}
      <fog attach="fog" args={[isNightMode ? '#080E1E' : '#EEF3F8', 45, 110]} />

      {/* Moving Clouds */}
      <group ref={cloudGroupRef}>
        {cloudPositions.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[4 + (idx % 3), 12, 12]} />
            <meshStandardMaterial
              color={isNightMode ? '#1E293B' : '#FFFFFF'}
              transparent
              opacity={isNightMode ? 0.25 : 0.45}
              roughness={1}
            />
          </mesh>
        ))}
      </group>

      {/* Floating Ambient Particles */}
      <points ref={particleGroupRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          color={isNightMode ? '#00D8FF' : '#3B82F6'}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </>
  );
};
