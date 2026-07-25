import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../store/useCityStore';

interface VehicleData {
  id: number;
  axis: 'X' | 'Z';
  fixedCoord: number;
  startPos: number;
  speed: number;
  color: string;
}

export const MovingVehicles: React.FC = () => {
  const isNightMode = useCityStore((state) => state.isNightMode);
  const vehiclesRef = useRef<THREE.Group>(null);

  const vehicles: VehicleData[] = useMemo(() => {
    const arr: VehicleData[] = [];
    const colors = ['#3B82F6', '#00D8FF', '#F59E0B', '#34D399', '#60A5FA', '#FBBF24', '#38BDF8'];
    
    // East-West Roads (Z = -6.5 and Z = 6.5)
    [-6.5, 6.5].forEach((zRoad) => {
      // Lane 1: Right Lane (+0.85 offset), Eastbound (+X)
      for (let i = 0; i < 3; i++) {
        arr.push({
          id: arr.length,
          axis: 'X',
          fixedCoord: zRoad + 0.85,
          startPos: -35 + i * 22 + Math.random() * 4,
          speed: 7.5 + Math.random() * 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      // Lane 2: Left Lane (-0.85 offset), Westbound (-X)
      for (let i = 0; i < 3; i++) {
        arr.push({
          id: arr.length,
          axis: 'X',
          fixedCoord: zRoad - 0.85,
          startPos: 35 - i * 22 - Math.random() * 4,
          speed: -(7.5 + Math.random() * 2.5),
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    });

    // North-South Roads (X = -6.5 and X = 6.5)
    [-6.5, 6.5].forEach((xRoad) => {
      // Lane 1: Right Lane (+0.85 offset), Southbound (+Z)
      for (let i = 0; i < 3; i++) {
        arr.push({
          id: arr.length,
          axis: 'Z',
          fixedCoord: xRoad + 0.85,
          startPos: -35 + i * 22 + Math.random() * 4,
          speed: 7.5 + Math.random() * 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      // Lane 2: Left Lane (-0.85 offset), Northbound (-Z)
      for (let i = 0; i < 3; i++) {
        arr.push({
          id: arr.length,
          axis: 'Z',
          fixedCoord: xRoad - 0.85,
          startPos: 35 - i * 22 - Math.random() * 4,
          speed: -(7.5 + Math.random() * 2.5),
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    });

    return arr;
  }, []);

  const meshRefs = useRef<{ [key: number]: THREE.Group | null }>({});

  useFrame((_, delta) => {
    vehicles.forEach((v) => {
      const g = meshRefs.current[v.id];
      if (!g) return;

      if (v.axis === 'X') {
        g.position.x += v.speed * delta;
        if (g.position.x > 35) g.position.x = -35;
        if (g.position.x < -35) g.position.x = 35;
      } else {
        g.position.z += v.speed * delta;
        if (g.position.z > 35) g.position.z = -35;
        if (g.position.z < -35) g.position.z = 35;
      }
    });
  });

  return (
    <group ref={vehiclesRef}>
      {vehicles.map((v) => (
        <group
          key={v.id}
          ref={(el) => (meshRefs.current[v.id] = el)}
          position={
            v.axis === 'X'
              ? [v.startPos, 0.12, v.fixedCoord]
              : [v.fixedCoord, 0.12, v.startPos]
          }
          rotation={[0, v.axis === 'X' ? (v.speed > 0 ? 0 : Math.PI) : (v.speed > 0 ? -Math.PI / 2 : Math.PI / 2), 0]}
        >
          {/* Car Body */}
          <mesh castShadow position={[0, 0.12, 0]}>
            <boxGeometry args={[0.75, 0.22, 0.35]} />
            <meshStandardMaterial color={v.color} roughness={0.3} metalness={0.5} />
          </mesh>

          {/* Car Cabin */}
          <mesh position={[-0.05, 0.26, 0]}>
            <boxGeometry args={[0.42, 0.16, 0.3]} />
            <meshStandardMaterial color="#1E293B" roughness={0.1} />
          </mesh>

          {/* Headlights (Glowing at night) */}
          <mesh position={[0.38, 0.12, 0.12]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={isNightMode ? '#38BDF8' : '#FEF08A'} />
          </mesh>
          <mesh position={[0.38, 0.12, -0.12]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={isNightMode ? '#38BDF8' : '#FEF08A'} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
