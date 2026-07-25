import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../store/useCityStore';

export const InfrastructureLayerOverlay: React.FC = () => {
  const activeLayer = useCityStore((state) => state.activeLayer);
  const buildings = useCityStore((state) => state.buildings);
  const linesGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!linesGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    linesGroupRef.current.rotation.y = Math.sin(t * 0.2) * 0.05;
  });

  if (!activeLayer) return null;

  return (
    <group ref={linesGroupRef}>
      {/* ELECTRICITY LAYER: Glowing power lines connecting roof tops */}
      {activeLayer === 'electricity' && (
        <group>
          {buildings.map((b, idx) => {
            const nextB = buildings[(idx + 1) % buildings.length];
            const start = new THREE.Vector3(b.position[0], b.dimensions[1] + 0.5, b.position[2]);
            const end = new THREE.Vector3(nextB.position[0], nextB.dimensions[1] + 0.5, nextB.position[2]);

            // Curve points
            const mid = new THREE.Vector3()
              .addVectors(start, end)
              .multiplyScalar(0.5)
              .add(new THREE.Vector3(0, 3, 0));

            const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
            const points = curve.getPoints(20);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            return (
              <line key={`power-${b.id}`}>
                <bufferGeometry attach="geometry" {...geometry} />
                <lineBasicMaterial attach="material" color="#00D8FF" linewidth={3} />
              </line>
            );
          })}
        </group>
      )}

      {/* WATER LAYER: Underground/surface cyan water pipes */}
      {activeLayer === 'water' && (
        <group>
          {buildings.map((b) => (
            <mesh
              key={`pipe-${b.id}`}
              position={[b.position[0], 0.15, b.position[2]]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.8, 1.2, 16]} />
              <meshBasicMaterial color="#06B6D4" transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {/* HVAC LAYER: Rising cooling thermal indicators */}
      {activeLayer === 'hvac' && (
        <group>
          {buildings.map((b) => (
            <mesh key={`hvac-thermal-${b.id}`} position={[b.position[0], b.dimensions[1] + 1.2, b.position[2]]}>
              <cylinderGeometry args={[1.2, 0.4, 1.8, 16, 1, true]} />
              <meshBasicMaterial color="#60A5FA" transparent opacity={0.35} wireframe />
            </mesh>
          ))}
        </group>
      )}

      {/* OCCUPANCY HEATMAP LAYER */}
      {activeLayer === 'occupancy' && (
        <group>
          {buildings.map((b) => (
            <mesh key={`occ-${b.id}`} position={[b.position[0], 0.05, b.position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[b.occupancy > 90 ? 3.8 : 2.8, 24]} />
              <meshBasicMaterial
                color={b.occupancy > 90 ? '#EF4444' : b.occupancy > 80 ? '#F59E0B' : '#34D399'}
                transparent
                opacity={0.5}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* FIRE SAFETY LAYER */}
      {activeLayer === 'fire' && (
        <group>
          {buildings.map((b) => (
            <group key={`fire-${b.id}`} position={[b.position[0], b.dimensions[1] + 0.8, b.position[2]]}>
              <mesh>
                <sphereGeometry args={[0.35, 12, 12]} />
                <meshBasicMaterial color={b.fireSafetyHealth < 50 ? '#EF4444' : '#34D399'} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* SOLAR LAYER */}
      {activeLayer === 'solar' && (
        <group>
          {buildings.map((b) => (
            <mesh key={`solar-node-${b.id}`} position={[b.position[0], b.dimensions[1] + 0.4, b.position[2]]}>
              <boxGeometry args={[b.dimensions[0] * 0.8, 0.1, b.dimensions[2] * 0.8]} />
              <meshBasicMaterial color="#FBBF24" transparent opacity={0.65} />
            </mesh>
          ))}
        </group>
      )}

      {/* INTERNET MESH LAYER */}
      {activeLayer === 'internet' && (
        <group position={[0, 16, 0]}>
          {buildings.map((b) => (
            <mesh key={`net-${b.id}`} position={[b.position[0], 0, b.position[2]]}>
              <octahedronGeometry args={[0.6]} />
              <meshBasicMaterial color="#8B5CF6" wireframe />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
