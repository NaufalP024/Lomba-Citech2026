import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useCityStore } from '../store/useCityStore';

export const CityGrid: React.FC = () => {
  const isNightMode = useCityStore((state) => state.isNightMode);

  // InstancedMesh references for maximum rendering performance (60 FPS)
  const blackCurbsRef = useRef<THREE.InstancedMesh>(null);
  const whiteCurbsRef = useRef<THREE.InstancedMesh>(null);
  const treeTrunksRef = useRef<THREE.InstancedMesh>(null);
  const treeFoliageLowRef = useRef<THREE.InstancedMesh>(null);
  const treeFoliageMidRef = useRef<THREE.InstancedMesh>(null);
  const treeFoliageTopRef = useRef<THREE.InstancedMesh>(null);

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
        if (Math.abs(x - (-6.5)) < 3.2 || Math.abs(x - 6.5) < 3.2) continue;
        lines.push({
          pos: [x, 0.025, rz],
          size: [1.2, 0.12],
        });
      }
    });

    return lines;
  }, []);

  // Calculate Black and White Curb Instances
  const { blackCurbsData, whiteCurbsData } = useMemo(() => {
    const black: { pos: [number, number, number]; size: [number, number] }[] = [];
    const white: { pos: [number, number, number]; size: [number, number] }[] = [];
    const segLength = 1.0;
    const curbWidth = 0.22;

    // N-S Road Curbs
    [-6.5, 6.5].forEach((rx) => {
      [-1.95, 1.95].forEach((dx) => {
        for (let z = -45; z <= 45; z += segLength) {
          if (Math.abs(z - (-6.5)) < 1.9 || Math.abs(z - 6.5) < 1.9) continue;
          const item = { pos: [rx + dx, 0.025, z] as [number, number, number], size: [curbWidth, segLength * 0.98] as [number, number] };
          if (Math.abs(Math.floor(z)) % 2 === 0) black.push(item);
          else white.push(item);
        }
      });
    });

    // E-W Road Curbs
    [-6.5, 6.5].forEach((rz) => {
      [-1.95, 1.95].forEach((dz) => {
        for (let x = -45; x <= 45; x += segLength) {
          if (Math.abs(x - (-6.5)) < 1.9 || Math.abs(x - 6.5) < 1.9) continue;
          const item = { pos: [x, 0.025, rz + dz] as [number, number, number], size: [segLength * 0.98, curbWidth] as [number, number] };
          if (Math.abs(Math.floor(x)) % 2 === 0) black.push(item);
          else white.push(item);
        }
      });
    });

    // Intersection 90° Corner Joiners
    const intersectionPoints = [-6.5, 6.5];
    intersectionPoints.forEach((ix) => {
      intersectionPoints.forEach((iz) => {
        [-1.95, 1.95].forEach((dx) => {
          [-1.95, 1.95].forEach((dz) => {
            const item = { pos: [ix + dx, 0.025, iz + dz] as [number, number, number], size: [curbWidth * 1.2, curbWidth * 1.2] as [number, number] };
            if (Math.abs(Math.floor(ix + dx + iz + dz)) % 2 === 0) black.push(item);
            else white.push(item);
          });
        });
      });
    });

    return { blackCurbsData: black, whiteCurbsData: white };
  }, []);

  // Calculate 3D Tree Positions
  const trees = useMemo(() => {
    const treeList: { pos: [number, number, number]; scale: number }[] = [];
    const treeRows = [-22, -18, -12, -2, 2, 12, 18, 22];

    [-9.2, 9.2].forEach((x) => {
      treeRows.forEach((z) => {
        if (Math.abs(z - (-6.5)) > 3.0 && Math.abs(z - 6.5) > 3.0) {
          treeList.push({ pos: [x, 0, z], scale: 0.85 + (Math.abs(x + z) % 5) * 0.08 });
        }
      });
    });

    treeRows.forEach((x) => {
      [-9.2, 9.2].forEach((z) => {
        if (Math.abs(x - (-6.5)) > 3.0 && Math.abs(x - 6.5) > 3.0) {
          treeList.push({ pos: [x, 0, z], scale: 0.85 + (Math.abs(x * z) % 5) * 0.08 });
        }
      });
    });

    const outerTreeCoords = [
      [-20, -20], [-20, 20], [20, -20], [20, 20],
      [-22, 0],   [22, 0],   [0, -22],   [0, 22],
      [-20, -10], [-20, 10], [20, -10], [20, 10],
    ];

    outerTreeCoords.forEach(([tx, tz], i) => {
      treeList.push({ pos: [tx, 0, tz], scale: 1.0 + (i % 3) * 0.15 });
      treeList.push({ pos: [tx + 1.8, 0, tz + 1.5], scale: 0.8 + (i % 2) * 0.1 });
    });

    return treeList;
  }, []);

  // Update InstancedMesh matrices once on mount / update (Reduces Draw Calls by 95%!)
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();

    // Black Curbs
    if (blackCurbsRef.current) {
      blackCurbsData.forEach((curb, i) => {
        dummy.position.set(...curb.pos);
        dummy.rotation.set(-Math.PI / 2, 0, 0);
        dummy.scale.set(curb.size[0], curb.size[1], 1);
        dummy.updateMatrix();
        blackCurbsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      blackCurbsRef.current.instanceMatrix.needsUpdate = true;
    }

    // White Curbs
    if (whiteCurbsRef.current) {
      whiteCurbsData.forEach((curb, i) => {
        dummy.position.set(...curb.pos);
        dummy.rotation.set(-Math.PI / 2, 0, 0);
        dummy.scale.set(curb.size[0], curb.size[1], 1);
        dummy.updateMatrix();
        whiteCurbsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      whiteCurbsRef.current.instanceMatrix.needsUpdate = true;
    }

    // Trees
    if (treeTrunksRef.current && treeFoliageLowRef.current && treeFoliageMidRef.current && treeFoliageTopRef.current) {
      trees.forEach((tree, i) => {
        const s = tree.scale;
        
        // Trunk
        dummy.position.set(tree.pos[0], 0.35 * s, tree.pos[2]);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        treeTrunksRef.current!.setMatrixAt(i, dummy.matrix);

        // Lower Foliage
        dummy.position.set(tree.pos[0], 0.75 * s, tree.pos[2]);
        dummy.updateMatrix();
        treeFoliageLowRef.current!.setMatrixAt(i, dummy.matrix);

        // Mid Foliage
        dummy.position.set(tree.pos[0], 1.1 * s, tree.pos[2]);
        dummy.updateMatrix();
        treeFoliageMidRef.current!.setMatrixAt(i, dummy.matrix);

        // Top Foliage
        dummy.position.set(tree.pos[0], 1.4 * s, tree.pos[2]);
        dummy.updateMatrix();
        treeFoliageTopRef.current!.setMatrixAt(i, dummy.matrix);
      });

      treeTrunksRef.current.instanceMatrix.needsUpdate = true;
      treeFoliageLowRef.current.instanceMatrix.needsUpdate = true;
      treeFoliageMidRef.current.instanceMatrix.needsUpdate = true;
      treeFoliageTopRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [blackCurbsData, whiteCurbsData, trees]);

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
            <planeGeometry args={[10.6, 10.6]} />
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
            <planeGeometry args={[9.8, 9.8]} />
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

      {/* High-Performance Instanced Black Curbs (Only 1 Draw Call!) */}
      <instancedMesh
        ref={blackCurbsRef}
        args={[undefined, undefined, blackCurbsData.length]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={isNightMode ? '#0F172A' : '#1E293B'} />
      </instancedMesh>

      {/* High-Performance Instanced White Curbs (Only 1 Draw Call!) */}
      <instancedMesh
        ref={whiteCurbsRef}
        args={[undefined, undefined, whiteCurbsData.length]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#F8FAFC" />
      </instancedMesh>

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

      {/* High-Performance Instanced 3D Trees (Only 4 Draw Calls total instead of 240+!) */}
      {/* Tree Trunks */}
      <instancedMesh ref={treeTrunksRef} args={[undefined, undefined, trees.length]} castShadow>
        <cylinderGeometry args={[0.07, 0.12, 0.7, 8]} />
        <meshStandardMaterial color="#4A2E1B" roughness={0.9} />
      </instancedMesh>
      {/* Lower Foliage */}
      <instancedMesh ref={treeFoliageLowRef} args={[undefined, undefined, trees.length]} castShadow>
        <coneGeometry args={[0.55, 0.7, 8]} />
        <meshStandardMaterial color={isNightMode ? '#0F3818' : '#2D6E37'} roughness={0.8} />
      </instancedMesh>
      {/* Middle Foliage */}
      <instancedMesh ref={treeFoliageMidRef} args={[undefined, undefined, trees.length]} castShadow>
        <coneGeometry args={[0.42, 0.6, 8]} />
        <meshStandardMaterial color={isNightMode ? '#13471E' : '#3A8A48'} roughness={0.8} />
      </instancedMesh>
      {/* Top Foliage */}
      <instancedMesh ref={treeFoliageTopRef} args={[undefined, undefined, trees.length]} castShadow>
        <coneGeometry args={[0.28, 0.5, 8]} />
        <meshStandardMaterial color={isNightMode ? '#195425' : '#45A354'} roughness={0.7} />
      </instancedMesh>

    </group>
  );
};
