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
      for (let z = -42; z <= 42; z += step) {
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
      for (let x = -42; x <= 42; x += step) {
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

  // Helper to generate alternating Black & White Roadside Sidewalk Curbs (Trotoar Hitam Putih - Seamless & Continuous)
  const blackWhiteCurbs = useMemo(() => {
    const curbs: { pos: [number, number, number]; size: [number, number]; isBlack: boolean }[] = [];
    const segLength = 1.0;
    const curbWidth = 0.22;

    // N-S Road Curbs (X = -6.5, X = 6.5) - Extended from -45 to 45 with full corner connection
    [-6.5, 6.5].forEach((rx) => {
      [-1.95, 1.95].forEach((dx) => {
        let count = 0;
        for (let z = -45; z <= 45; z += segLength) {
          // Skip only inner crosswalk box (around z = -6.5 and z = 6.5)
          if (Math.abs(z - (-6.5)) < 1.9 || Math.abs(z - 6.5) < 1.9) continue;
          curbs.push({
            pos: [rx + dx, 0.025, z],
            size: [curbWidth, segLength * 0.98],
            isBlack: Math.abs(Math.floor(z)) % 2 === 0,
          });
          count++;
        }
      });
    });

    // E-W Road Curbs (Z = -6.5, Z = 6.5) - Extended from -45 to 45 with full corner connection
    [-6.5, 6.5].forEach((rz) => {
      [-1.95, 1.95].forEach((dz) => {
        let count = 0;
        for (let x = -45; x <= 45; x += segLength) {
          // Skip only inner crosswalk box (around x = -6.5 and x = 6.5)
          if (Math.abs(x - (-6.5)) < 1.9 || Math.abs(x - 6.5) < 1.9) continue;
          curbs.push({
            pos: [x, 0.025, rz + dz],
            size: [segLength * 0.98, curbWidth],
            isBlack: Math.abs(Math.floor(x)) % 2 === 0,
          });
          count++;
        }
      });
    });

    // Intersection 90-degree Corner Joiner Pads at all 4 main intersections
    const intersectionPoints = [-6.5, 6.5];
    intersectionPoints.forEach((ix) => {
      intersectionPoints.forEach((iz) => {
        [-1.95, 1.95].forEach((dx) => {
          [-1.95, 1.95].forEach((dz) => {
            curbs.push({
              pos: [ix + dx, 0.025, iz + dz],
              size: [curbWidth * 1.2, curbWidth * 1.2],
              isBlack: Math.abs(Math.floor(ix + dx + iz + dz)) % 2 === 0,
            });
          });
        });
      });
    });

    return curbs;
  }, []);

  // Helper to generate 3D Tree Positions throughout the city green park belts
  const trees = useMemo(() => {
    const treeList: { pos: [number, number, number]; scale: number }[] = [];

    // Tree placement along N-S and E-W sidewalk green buffers
    const treeRows = [-22, -18, -12, -2, 2, 12, 18, 22];

    [-9.2, 9.2].forEach((x) => {
      treeRows.forEach((z) => {
        if (Math.abs(z - (-6.5)) > 3.0 && Math.abs(z - 6.5) > 3.0) {
          treeList.push({
            pos: [x, 0, z],
            scale: 0.85 + (Math.abs(x + z) % 5) * 0.08,
          });
        }
      });
    });

    treeRows.forEach((x) => {
      [-9.2, 9.2].forEach((z) => {
        if (Math.abs(x - (-6.5)) > 3.0 && Math.abs(x - 6.5) > 3.0) {
          treeList.push({
            pos: [x, 0, z],
            scale: 0.85 + (Math.abs(x * z) % 5) * 0.08,
          });
        }
      });
    });

    // Park corner trees in outer lawns
    const outerTreeCoords = [
      [-20, -20], [-20, 20], [20, -20], [20, 20],
      [-22, 0],   [22, 0],   [0, -22],   [0, 22],
      [-20, -10], [-20, 10], [20, -10], [20, 10],
    ];

    outerTreeCoords.forEach(([tx, tz], i) => {
      treeList.push({
        pos: [tx, 0, tz],
        scale: 1.0 + (i % 3) * 0.15,
      });
      treeList.push({
        pos: [tx + 1.8, 0, tz + 1.5],
        scale: 0.8 + (i % 2) * 0.1,
      });
    });

    return treeList;
  }, []);

  return (
    <group position={[0, -0.01, 0]}>
      {/* Main Ground Base (Realistic Green Grass Terrain) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial
          color={isNightMode ? '#0D2216' : '#3B6E38'}
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      {/* Block Sidewalk Foundations under building lots */}
      {[
        [-14.5, -14.5], [0, -14.5], [14.5, -14.5],
        [-14.5, 0],     [0, 0],     [14.5, 0],
        [-14.5, 14.5],  [0, 14.5],  [14.5, 14.5],
      ].map(([px, pz], idx) => (
        <React.Fragment key={`plaza-group-${idx}`}>
          {/* Manicured Lawn Border */}
          <mesh
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[px, 0.005, pz]}
          >
            <planeGeometry args={[9.4, 9.4]} />
            <meshStandardMaterial
              color={isNightMode ? '#132E1E' : '#478044'}
              roughness={0.9}
            />
          </mesh>
          {/* Pedestrian Sidewalk Pad */}
          <mesh
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[px, 0.01, pz]}
          >
            <planeGeometry args={[8.4, 8.4]} />
            <meshStandardMaterial
              color={isNightMode ? '#1A2638' : '#DDE4ED'}
              roughness={0.8}
            />
          </mesh>
        </React.Fragment>
      ))}

      {/* Asphalt Roads Network (Full Length Extended to Edges) */}
      {/* North-South Road 1 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-6.5, 0.02, 0]}>
        <planeGeometry args={[3.6, 90]} />
        <meshStandardMaterial color={isNightMode ? '#151A24' : '#2A2E37'} roughness={0.9} metalness={0.1} />
      </mesh>
      {/* North-South Road 2 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[6.5, 0.02, 0]}>
        <planeGeometry args={[3.6, 90]} />
        <meshStandardMaterial color={isNightMode ? '#151A24' : '#2A2E37'} roughness={0.9} metalness={0.1} />
      </mesh>
      {/* East-West Road 1 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -6.5]}>
        <planeGeometry args={[90, 3.6]} />
        <meshStandardMaterial color={isNightMode ? '#151A24' : '#2A2E37'} roughness={0.9} metalness={0.1} />
      </mesh>
      {/* East-West Road 2 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 6.5]}>
        <planeGeometry args={[90, 3.6]} />
        <meshStandardMaterial color={isNightMode ? '#151A24' : '#2A2E37'} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Alternating Black & White Roadside Sidewalk Curbs (Trotoar Hitam Putih) */}
      {blackWhiteCurbs.map((curb, idx) => (
        <mesh
          key={`curb-bw-${idx}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={curb.pos}
        >
          <planeGeometry args={curb.size} />
          <meshBasicMaterial
            color={curb.isBlack ? (isNightMode ? '#0F172A' : '#1E293B') : '#F8FAFC'}
          />
        </mesh>
      ))}

      {/* White Dashed Center Lane Lines */}
      {dashedLaneMarkings.map((line, idx) => (
        <mesh
          key={`lane-${idx}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={line.pos}
        >
          <planeGeometry args={line.size} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={isNightMode ? 0.85 : 0.95} />
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
          <meshBasicMaterial color="#FFFFFF" transparent opacity={isNightMode ? 0.9 : 0.98} />
        </mesh>
      ))}

      {/* 3D Trees Decoration (Pepohonan Hijau Rindang) */}
      {trees.map((tree, idx) => (
        <group key={`tree-${idx}`} position={tree.pos} scale={[tree.scale, tree.scale, tree.scale]}>
          {/* Tree Trunk */}
          <mesh castShadow position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.07, 0.12, 0.7, 8]} />
            <meshStandardMaterial color="#4A2E1B" roughness={0.9} />
          </mesh>
          {/* Lower Foliage */}
          <mesh castShadow position={[0, 0.75, 0]}>
            <coneGeometry args={[0.55, 0.7, 8]} />
            <meshStandardMaterial
              color={isNightMode ? '#0F3818' : '#2D6E37'}
              roughness={0.8}
            />
          </mesh>
          {/* Middle Foliage */}
          <mesh castShadow position={[0, 1.1, 0]}>
            <coneGeometry args={[0.42, 0.6, 8]} />
            <meshStandardMaterial
              color={isNightMode ? '#13471E' : '#3A8A48'}
              roughness={0.8}
            />
          </mesh>
          {/* Top Foliage */}
          <mesh castShadow position={[0, 1.4, 0]}>
            <coneGeometry args={[0.28, 0.5, 8]} />
            <meshStandardMaterial
              color={isNightMode ? '#195425' : '#45A354'}
              roughness={0.7}
            />
          </mesh>
        </group>
      ))}

    </group>
  );
};
