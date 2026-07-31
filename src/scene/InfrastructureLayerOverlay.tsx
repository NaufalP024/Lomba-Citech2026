import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../store/useCityStore';
import { BuildingData } from '../types/city';

// Helper to calculate exact roof peak Y position for both custom GLTF models & procedural shapes
function getRoofHeight(b: BuildingData): number {
  const h = b.dimensions[1];
  if (b.architectureType === 'gltf') {
    // Group is at halfH above ground, model top = halfH + halfH = h (full building height)
    return h + 0.1;
  }
  return h + 0.35;
}

export const InfrastructureLayerOverlay: React.FC = () => {
  const activeLayer = useCityStore((state) => state.activeLayer);
  const buildings = useCityStore((state) => state.buildings);
  const layerGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!layerGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    layerGroupRef.current.rotation.y = Math.sin(t * 0.15) * 0.03;
  });

  if (!activeLayer) return null;

  return (
    <group ref={layerGroupRef}>
      {/* 1. ELECTRICITY LAYER: Arced Power Grid Lines Connecting Roof Peaks */}
      {activeLayer === 'electricity' && (
        <group>
          {buildings.map((b, idx) => {
            const nextB = buildings[(idx + 1) % buildings.length];
            const startY = getRoofHeight(b);
            const endY = getRoofHeight(nextB);

            const start = new THREE.Vector3(b.position[0], startY, b.position[2]);
            const end = new THREE.Vector3(nextB.position[0], endY, nextB.position[2]);

            // Gentle catenary curve mid-point
            const mid = new THREE.Vector3()
              .addVectors(start, end)
              .multiplyScalar(0.5)
              .add(new THREE.Vector3(0, 2.2, 0));

            const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
            const points = curve.getPoints(24);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            return (
              <React.Fragment key={`power-group-${b.id}`}>
                <line>
                  <bufferGeometry attach="geometry" {...geometry} />
                  <lineBasicMaterial attach="material" color="#00D8FF" linewidth={3} transparent opacity={0.85} />
                </line>
                {/* Roof Node Beacon */}
                <mesh position={[b.position[0], startY, b.position[2]]}>
                  <sphereGeometry args={[0.22, 12, 12]} />
                  <meshBasicMaterial color="#00D8FF" />
                </mesh>
              </React.Fragment>
            );
          })}
        </group>
      )}

      {/* 2. WATER LAYER: Pipeline Flow Rings Centered Around Building Foundations */}
      {activeLayer === 'water' && (
        <group>
          {buildings.map((b) => {
            const radius = Math.max(b.dimensions[0], b.dimensions[2]) * 0.55;
            return (
              <group key={`water-${b.id}`} position={[b.position[0], 0.03, b.position[2]]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[radius * 0.7, radius, 32]} />
                  <meshBasicMaterial color="#06B6D4" transparent opacity={0.65} side={THREE.DoubleSide} />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[radius * 1.1, radius * 1.25, 32]} />
                  <meshBasicMaterial color="#38BDF8" transparent opacity={0.4} side={THREE.DoubleSide} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* 3. HVAC LAYER: Thermal Ventilation Cylinders Placed Right at Rooftop Peak */}
      {activeLayer === 'hvac' && (
        <group>
          {buildings.map((b) => {
            const roofY = getRoofHeight(b);
            const radius = Math.min(b.dimensions[0], b.dimensions[2]) * 0.35;
            return (
              <mesh
                key={`hvac-${b.id}`}
                position={[b.position[0], roofY + 0.6, b.position[2]]}
              >
                <cylinderGeometry args={[radius, radius * 0.6, 1.2, 16, 1, true]} />
                <meshBasicMaterial color="#60A5FA" transparent opacity={0.5} wireframe />
              </mesh>
            );
          })}
        </group>
      )}

      {/* 4. OCCUPANCY HEATMAP LAYER: Scaled Pedestrian Heatmap Pads Matched to Model Footprint */}
      {activeLayer === 'occupancy' && (
        <group>
          {buildings.map((b) => {
            const w = b.dimensions[0] * 1.1;
            const d = b.dimensions[2] * 1.1;
            const heatColor =
              b.occupancy > 90 ? '#EF4444' : b.occupancy > 75 ? '#F59E0B' : '#34D399';

            return (
              <mesh
                key={`occ-${b.id}`}
                position={[b.position[0], 0.025, b.position[2]]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry args={[w, d]} />
                <meshBasicMaterial color={heatColor} transparent opacity={0.45} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* 5. FIRE SAFETY LAYER: Hovering Safety Beacons Aligned to Rooftops */}
      {activeLayer === 'fire' && (
        <group>
          {buildings.map((b) => {
            const roofY = getRoofHeight(b);
            const isSafe = b.fireSafetyHealth >= 80;
            return (
              <group key={`fire-${b.id}`} position={[b.position[0], roofY + 0.5, b.position[2]]}>
                <mesh>
                  <sphereGeometry args={[0.3, 16, 16]} />
                  <meshBasicMaterial color={isSafe ? '#10B981' : '#EF4444'} />
                </mesh>
                <mesh>
                  <ringGeometry args={[0.4, 0.6, 16]} />
                  <meshBasicMaterial color={isSafe ? '#34D399' : '#F87171'} transparent opacity={0.6} side={THREE.DoubleSide} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* 6. SOLAR LAYER: Solar Hologram Arrays Aligned Directly on Building Roof Peak */}
      {activeLayer === 'solar' && (
        <group>
          {buildings.map((b) => {
            const roofY = getRoofHeight(b);
            const w = b.dimensions[0] * 0.75;
            const d = b.dimensions[2] * 0.75;

            return (
              <mesh
                key={`solar-${b.id}`}
                position={[b.position[0], roofY + 0.08, b.position[2]]}
              >
                <boxGeometry args={[w, 0.06, d]} />
                <meshBasicMaterial color="#FBBF24" transparent opacity={0.7} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* 7. INTERNET MESH LAYER: 3D Diamond Nodes Connected by Cyber Mesh Lines */}
      {activeLayer === 'internet' && (
        <group>
          {buildings.map((b, idx) => {
            const nextB = buildings[(idx + 1) % buildings.length];
            const roofY = getRoofHeight(b) + 1.2;
            const nextRoofY = getRoofHeight(nextB) + 1.2;

            const posA = new THREE.Vector3(b.position[0], roofY, b.position[2]);
            const posB = new THREE.Vector3(nextB.position[0], nextRoofY, nextB.position[2]);

            const geometry = new THREE.BufferGeometry().setFromPoints([posA, posB]);

            return (
              <React.Fragment key={`net-${b.id}`}>
                {/* Node */}
                <mesh position={posA.toArray()}>
                  <octahedronGeometry args={[0.55]} />
                  <meshBasicMaterial color="#8B5CF6" wireframe />
                </mesh>
                {/* Connecting Laser Line */}
                <line>
                  <bufferGeometry attach="geometry" {...geometry} />
                  <lineBasicMaterial attach="material" color="#C084FC" linewidth={2} transparent opacity={0.75} />
                </line>
              </React.Fragment>
            );
          })}
        </group>
      )}

      {/* 8. ECO-GREEN & CARBON HEATMAP LAYER: Color-coded Eco Footprint & Rooftop Eco Beacons */}
      {activeLayer === 'eco_green' && (
        <group>
          {buildings.map((b) => {
            const roofY = getRoofHeight(b);
            const w = b.dimensions[0] * 1.15;
            const d = b.dimensions[2] * 1.15;
            const ecoColor =
              b.ecoStatus === 'Green' || (b.carbonEmission && b.carbonEmission < 250)
                ? '#10B981'
                : b.ecoStatus === 'Warning' || (b.carbonEmission && b.carbonEmission < 400)
                ? '#F59E0B'
                : '#EF4444';

            return (
              <group key={`eco-${b.id}`}>
                {/* Ground Base Eco Footprint */}
                <mesh
                  position={[b.position[0], 0.02, b.position[2]]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <planeGeometry args={[w, d]} />
                  <meshBasicMaterial color={ecoColor} transparent opacity={0.5} />
                </mesh>

                {/* Ground Pulse Ring */}
                <mesh
                  position={[b.position[0], 0.025, b.position[2]]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <ringGeometry args={[w * 0.55, w * 0.68, 32]} />
                  <meshBasicMaterial color={ecoColor} transparent opacity={0.65} side={THREE.DoubleSide} />
                </mesh>

                {/* Rooftop Floating Eco Beacon */}
                <group position={[b.position[0], roofY + 0.6, b.position[2]]}>
                  <mesh>
                    <octahedronGeometry args={[0.4]} />
                    <meshBasicMaterial color={ecoColor} />
                  </mesh>
                  <mesh rotation={[Math.PI / 4, 0, 0]}>
                    <torusGeometry args={[0.55, 0.04, 12, 24]} />
                    <meshBasicMaterial color={ecoColor} transparent opacity={0.7} />
                  </mesh>
                </group>
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
};
