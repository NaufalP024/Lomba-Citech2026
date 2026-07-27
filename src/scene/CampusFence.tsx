import React, { useMemo } from 'react';
import { useCityStore } from '../store/useCityStore';

/**
 * CampusFence.tsx
 * Low compact perimeter fence surrounding Politeknik Enjinering Indorama
 * featuring student seating gazebos (saung tempat duduk) and outdoor park benches.
 */
export const CampusFence: React.FC = () => {
  const isNightMode = useCityStore((state) => state.isNightMode);

  // Generate low compact vertical fence bars
  const fenceBars = useMemo(() => {
    const bars: [number, number, number][] = [];
    const spacing = 0.35; // 35cm bar spacing

    // Rear fence (Z = 9.7, X from -19.1 to -9.9)
    for (let x = -19.1; x <= -9.9; x += spacing) {
      bars.push([x, 0.28, 9.7]);
    }
    // Left fence (X = -19.3, Z from 9.9 to 19.1)
    for (let z = 9.9; z <= 19.1; z += spacing) {
      bars.push([-19.3, 0.28, z]);
    }

    // Front fence (Z = 19.3, X from -19.1 to -9.9)
    for (let x = -19.1; x <= -9.9; x += spacing) {
      bars.push([x, 0.28, 19.3]);
    }

    // Right fence (X = -9.7): Split into 2 segments leaving an OPEN ENTRANCE GAP at Z: 12.0 to 15.0
    // Segment 1 (Z: 9.9 to 11.8)
    for (let z = 9.9; z <= 11.8; z += spacing) {
      bars.push([-9.7, 0.28, z]);
    }
    // Segment 2 (Z: 15.2 to 19.1)
    for (let z = 15.2; z <= 19.1; z += spacing) {
      bars.push([-9.7, 0.28, z]);
    }

    return bars;
  }, []);

  // Gazebo locations in campus courtyard grounds (away from parking lot)
  const gazeboCoords: [number, number, number][] = [
    [-11.2, 0, 10.8], // Gazebo 1 (Rear-right courtyard away from parking lot)
  ];

  // Outdoor park bench locations along walkway plaza (away from parking lot, matching user's red line)
  const benchCoords: [number, number, number][] = [
    [-17.6, 0, 10.8], // Bench 1 (Rear-left courtyard away from parking lot)
    [-12.8, 0, 10.4], // Bench 2 (Exactly on user's red line mark!)
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* ================= STUDENT GAZEBOS (Gazebo / Saung Tempat Duduk Mahasiswa) ================= */}
      {gazeboCoords.map(([gx, gy, gz], idx) => (
        <group key={`campus-gazebo-${idx}`} position={[gx, gy, gz]}>
          {/* Raised Timber Deck Floor */}
          <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
            <boxGeometry args={[1.3, 0.12, 1.3]} />
            <meshStandardMaterial color="#854D0E" roughness={0.7} />
          </mesh>

          {/* 4 Wooden Support Pillars */}
          {[-0.5, 0.5].map((px) =>
            [-0.5, 0.5].map((pz) => (
              <mesh key={`pillar-${px}-${pz}`} castShadow position={[px, 0.5, pz]}>
                <cylinderGeometry args={[0.04, 0.04, 0.84, 8]} />
                <meshStandardMaterial color="#713F12" roughness={0.6} />
              </mesh>
            ))
          )}

          {/* Built-in Perimeter Seating Benches Inside Gazebo */}
          {/* Back bench seat */}
          <mesh position={[0, 0.25, -0.48]}>
            <boxGeometry args={[1.0, 0.04, 0.22]} />
            <meshStandardMaterial color="#A16207" roughness={0.6} />
          </mesh>
          {/* Front bench seat */}
          <mesh position={[0, 0.25, 0.48]}>
            <boxGeometry args={[1.0, 0.04, 0.22]} />
            <meshStandardMaterial color="#A16207" roughness={0.6} />
          </mesh>
          {/* Center Student Coffee/Study Table */}
          <mesh castShadow position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.28, 12]} />
            <meshStandardMaterial color="#713F12" roughness={0.5} />
          </mesh>

          {/* Pyramid Timber Roof Structure */}
          <mesh castShadow position={[0, 1.15, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[1.05, 0.55, 4]} />
            <meshStandardMaterial color="#451A03" roughness={0.4} />
          </mesh>

          {/* Interior Hanging Warm Lantern Lamp */}
          <mesh position={[0, 0.82, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color={isNightMode ? '#FDE047' : '#FEF08A'} />
          </mesh>
        </group>
      ))}

      {/* ================= OUTSIDE CAMPUS PARK BENCHES (Bangku Taman Mahasiswa) ================= */}
      {benchCoords.map(([bx, by, bz], idx) => (
        <group key={`campus-bench-${idx}`} position={[bx, by, bz]}>
          {/* Slatted Wood Seat */}
          <mesh castShadow position={[0, 0.22, 0]}>
            <boxGeometry args={[1.1, 0.05, 0.36]} />
            <meshStandardMaterial color="#B45309" roughness={0.6} />
          </mesh>
          {/* Wood Backrest */}
          <mesh castShadow position={[0, 0.42, -0.16]}>
            <boxGeometry args={[1.1, 0.28, 0.04]} />
            <meshStandardMaterial color="#B45309" roughness={0.6} />
          </mesh>

          {/* Cast Iron Legs */}
          {[-0.48, 0.48].map((lx) => (
            <group key={`leg-${lx}`} position={[lx, 0.1, 0]}>
              <mesh position={[0, 0, -0.14]}>
                <boxGeometry args={[0.04, 0.22, 0.04]} />
                <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
              </mesh>
              <mesh position={[0, 0, 0.14]}>
                <boxGeometry args={[0.04, 0.22, 0.04]} />
                <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* ================= STUDENT ENTRANCE DRIVEWAY (Jalan Masuk Mahasiswa) ================= */}
      {/* Seamless Asphalt Driveway Connector extending from main road into campus plaza */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-8.8, 0.026, 13.5]}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshStandardMaterial color={isNightMode ? '#151A24' : '#2A2E37'} roughness={0.9} />
      </mesh>

      {/* Speed Bump at Campus Gate Entrance (Polisi Tidur Aspal dengan Garis Kuning Miring) */}
      <group position={[-9.2, 0.03, 13.5]}>
        {/* Dark Asphalt Speed Bump Base Strip */}
        <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[0.42, 0.04, 3.1]} />
          <meshStandardMaterial color={isNightMode ? '#0F172A' : '#1E293B'} roughness={0.9} />
        </mesh>

        {/* Diagonal Slanted Yellow Safety Stripes (Garis Kuning Miring) */}
        {[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2].map((offsetZ, idx) => (
          <mesh
            key={`bump-stripe-${idx}`}
            rotation={[-Math.PI / 2, 0, Math.PI / 4]}
            position={[0, 0.042, offsetZ]}
          >
            <planeGeometry args={[0.1, 0.48]} />
            <meshBasicMaterial color="#F59E0B" />
          </mesh>
        ))}
      </group>

      {/* Entrance Pillar Posts flanking the student entrance driveway */}
      <group position={[-9.7, 0, 11.8]}>
        <mesh castShadow position={[0, 0.35, 0]}>
          <boxGeometry args={[0.25, 0.7, 0.25]} />
          <meshStandardMaterial color={isNightMode ? '#0F172A' : '#334155'} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color={isNightMode ? '#38BDF8' : '#FEF08A'} />
        </mesh>
      </group>

      <group position={[-9.7, 0, 15.2]}>
        <mesh castShadow position={[0, 0.35, 0]}>
          <boxGeometry args={[0.25, 0.7, 0.25]} />
          <meshStandardMaterial color={isNightMode ? '#0F172A' : '#334155'} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color={isNightMode ? '#38BDF8' : '#FEF08A'} />
        </mesh>
      </group>

      {/* ================= COMPACT LOW PERIMETER BASE CURBS ================= */}
      <mesh receiveShadow castShadow position={[-14.5, 0.05, 9.7]}>
        <boxGeometry args={[9.6, 0.1, 0.12]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[-19.3, 0.05, 14.5]}>
        <boxGeometry args={[0.12, 0.1, 9.6]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[-14.5, 0.05, 19.3]}>
        <boxGeometry args={[9.6, 0.1, 0.12]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>

      <mesh receiveShadow castShadow position={[-9.7, 0.05, 10.75]}>
        <boxGeometry args={[0.12, 0.1, 2.1]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[-9.7, 0.05, 17.25]}>
        <boxGeometry args={[0.12, 0.1, 4.1]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>

      {/* ================= COMPACT LOW TOP FENCE RAILS ================= */}
      <mesh position={[-14.5, 0.48, 9.7]}>
        <boxGeometry args={[9.6, 0.03, 0.04]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-19.3, 0.48, 14.5]}>
        <boxGeometry args={[0.04, 0.03, 9.6]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-14.5, 0.48, 19.3]}>
        <boxGeometry args={[9.6, 0.03, 0.04]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      <mesh position={[-9.7, 0.48, 10.75]}>
        <boxGeometry args={[0.04, 0.03, 2.1]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-9.7, 0.48, 17.25]}>
        <boxGeometry args={[0.04, 0.03, 4.1]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ================= VERTICAL STEEL FENCE BARS ================= */}
      {fenceBars.map((pos, idx) => (
        <mesh key={`low-bar-${idx}`} castShadow position={pos}>
          <boxGeometry args={[0.025, 0.42, 0.025]} />
          <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
};
