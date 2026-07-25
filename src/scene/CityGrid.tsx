import React, { useMemo } from 'react';
import { useCityStore } from '../store/useCityStore';

export const CityGrid: React.FC = () => {
  const isNightMode = useCityStore((state) => state.isNightMode);

  // Calculate 4 intersection positions: [-6.5, -6.5], [6.5, -6.5], [-6.5, 6.5], [6.5, 6.5]
  const intersections: [number, number][] = [
    [-6.5, -6.5],
    [6.5, -6.5],
    [-6.5, 6.5],
    [6.5, 6.5],
  ];

  // Helper to generate zebra crosswalk stripe positions around each intersection
  const zebraStripes = useMemo(() => {
    const stripes: { pos: [number, number, number]; size: [number, number] }[] = [];

    intersections.forEach(([ix, iz]) => {
      const offset = 2.2;
      const stripeCount = 6;
      const stripeWidth = 0.25;
      const stripeLength = 1.0;
      const gap = 0.45;

      // North & South Crosswalks (horizontal orientation)
      [-offset, offset].forEach((dz) => {
        for (let k = 0; k < stripeCount; k++) {
          const dx = (k - (stripeCount - 1) / 2) * gap;
          stripes.push({
            pos: [ix + dx, 0.026, iz + dz],
            size: [stripeWidth, stripeLength],
          });
        }
      });

      // East & West Crosswalks (vertical orientation)
      [-offset, offset].forEach((dx) => {
        for (let k = 0; k < stripeCount; k++) {
          const dz = (k - (stripeCount - 1) / 2) * gap;
          stripes.push({
            pos: [ix + dx, 0.026, iz + dz],
            size: [stripeLength, stripeWidth],
          });
        }
      });
    });

    return stripes;
  }, []);

  // Helper to generate white dashed center lane lines along roads
  const dashedLaneMarkings = useMemo(() => {
    const lines: { pos: [number, number, number]; size: [number, number] }[] = [];
    const step = 2.5;

    // N-S Roads (X = -6.5, X = 6.5)
    [-6.5, 6.5].forEach((rx) => {
      for (let z = -22; z <= 22; z += step) {
        // Skip intersection boxes (around z = -6.5 and z = 6.5)
        if (Math.abs(z - (-6.5)) < 3.2 || Math.abs(z - 6.5) < 3.2) continue;
        lines.push({
          pos: [rx, 0.025, z],
          size: [0.12, 1.2],
        });
      }
    });

    // E-W Roads (Z = -6.5, Z = 6.5)
    [-6.5, 6.5].forEach((rz) => {
      for (let x = -22; x <= 22; x += step) {
        // Skip intersection boxes (around x = -6.5 and x = 6.5)
        if (Math.abs(x - (-6.5)) < 3.2 || Math.abs(x - 6.5) < 3.2) continue;
        lines.push({
          pos: [x, 0.025, rz],
          size: [1.2, 0.12],
        });
      }
    });

    return lines;
  }, []);

  return (
    <group position={[0, -0.01, 0]}>
      {/* Main Ground Base */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial
          color={isNightMode ? '#0B132B' : '#E2E8F0'}
          roughness={0.8}
        />
      </mesh>

      {/* Block Plaza Foundations (9 Plaza Pads with setback boundaries) */}
      {[
        [-14.5, -14.5], [0, -14.5], [14.5, -14.5],
        [-14.5, 0],     [0, 0],     [14.5, 0],
        [-14.5, 14.5],  [0, 14.5],  [14.5, 14.5],
      ].map(([px, pz], idx) => (
        <mesh
          key={`plaza-${idx}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[px, 0.01, pz]}
        >
          <planeGeometry args={[9.0, 9.0]} />
          <meshStandardMaterial
            color={isNightMode ? '#15203B' : '#EDF2F7'}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Asphalt Roads Network (Clear Corridors at X = -6.5, 6.5, Z = -6.5, 6.5) */}
      {/* North-South Road 1 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-6.5, 0.02, 0]}>
        <planeGeometry args={[3.4, 46]} />
        <meshStandardMaterial color={isNightMode ? '#1C2938' : '#CBD5E1'} roughness={0.6} />
      </mesh>
      {/* North-South Road 2 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[6.5, 0.02, 0]}>
        <planeGeometry args={[3.4, 46]} />
        <meshStandardMaterial color={isNightMode ? '#1C2938' : '#CBD5E1'} roughness={0.6} />
      </mesh>
      {/* East-West Road 1 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -6.5]}>
        <planeGeometry args={[46, 3.4]} />
        <meshStandardMaterial color={isNightMode ? '#1C2938' : '#CBD5E1'} roughness={0.6} />
      </mesh>
      {/* East-West Road 2 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 6.5]}>
        <planeGeometry args={[46, 3.4]} />
        <meshStandardMaterial color={isNightMode ? '#1C2938' : '#CBD5E1'} roughness={0.6} />
      </mesh>

      {/* White Dashed Center Lane Lines */}
      {dashedLaneMarkings.map((line, idx) => (
        <mesh
          key={`lane-${idx}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={line.pos}
        >
          <planeGeometry args={line.size} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={isNightMode ? 0.75 : 0.9} />
        </mesh>
      ))}

      {/* White Zebra Crosswalks at Intersections */}
      {zebraStripes.map((stripe, idx) => (
        <mesh
          key={`zebra-${idx}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={stripe.pos}
        >
          <planeGeometry args={stripe.size} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={isNightMode ? 0.85 : 0.95} />
        </mesh>
      ))}

      {/* Subtle Ground Grid Overlay */}
      <gridHelper
        args={[70, 70, isNightMode ? '#1E293B' : '#CBD5E1', isNightMode ? '#0F172A' : '#E2E8F0']}
        position={[0, 0.03, 0]}
      />
    </group>
  );
};
