import React, { useMemo } from 'react';
import { useCityStore } from '../store/useCityStore';

/**
 * PanyawanganFence.tsx
 * Perimeter fence surrounding Bale Panyawangan (Center Plot [0, 0, 0]):
 * - Compact steel railing fence retracted inside pad so road curbs stay outside
 * - Front entrance gate located on the red box mark (Z = 4.4, X: -3.2 to -0.8)
 * - Entrance gate flanked by pillar posts (WITHOUT red barrier gate arm)
 * - Asphalt speed bump with diagonal yellow stripes across driveway entrance
 * - Front parking lot row along inner fence (matching red line annotation) with 2 parked cars
 */
export const PanyawanganFence: React.FC = () => {
  const isNightMode = useCityStore((state) => state.isNightMode);

  // Perimeter steel fence bars (retracted inside pad: X: -4.4 to 4.4, Z: -4.4 to 4.4)
  const fenceBars = useMemo(() => {
    const bars: [number, number, number][] = [];
    const spacing = 0.35; // 35cm bar spacing

    // Rear fence (Z = -4.4, X from -4.2 to 4.2)
    for (let x = -4.2; x <= 4.2; x += spacing) {
      bars.push([x, 0.28, -4.4]);
    }

    // Left fence (X = -4.4, Z from -4.2 to 4.2)
    for (let z = -4.2; z <= 4.2; z += spacing) {
      bars.push([-4.4, 0.28, z]);
    }

    // Right fence (X = 4.4, Z from -4.2 to 4.2 - Fully solid)
    for (let z = -4.2; z <= 4.2; z += spacing) {
      bars.push([4.4, 0.28, z]);
    }

    // Front fence (Z = 4.4): Open gap for Entrance Gate matching red box mark at X: -3.2 to -0.8
    // Segment 1 (X: -4.2 to -3.4)
    for (let x = -4.2; x <= -3.4; x += spacing) {
      bars.push([x, 0.28, 4.4]);
    }
    // Segment 2 (X: -0.6 to 4.2)
    for (let x = -0.6; x <= 4.2; x += spacing) {
      bars.push([x, 0.28, 4.4]);
    }

    return bars;
  }, []);

  // Corner Pillars
  const cornerPillars = [
    [-4.4, -4.4],
    [4.4, -4.4],
    [-4.4, 4.4],
    [4.4, 4.4],
  ];

  // Front Parking Row (5 bays along front fence at Z = 3.5, matching red line annotation)
  const parkingSlots = [
    { x: -0.4, z: 3.5, hasCar: false },
    { x: 0.5, z: 3.5, hasCar: true, color: '#3B82F6' },  // Car 1: Royal Blue
    { x: 1.4, z: 3.5, hasCar: false },
    { x: 2.3, z: 3.5, hasCar: true, color: '#EF4444' },  // Car 2: Crimson Red
    { x: 3.2, z: 3.5, hasCar: false },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* ================= FRONT PARKING LOT (Red Line) ================= */}
      {/* Asphalt parking pad overlay along front fence */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[1.4, 0.015, 3.5]}>
        <planeGeometry args={[4.4, 1.3]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#CBD5E1'} roughness={0.8} />
      </mesh>

      {/* Parking Slots White Line Markings & Parked Cars */}
      {parkingSlots.map((slot, idx) => (
        <group key={`panyawangan-slot-${idx}`} position={[slot.x, 0.02, slot.z]}>
          {/* Left Border Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.35, 0, 0]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={isNightMode ? 0.8 : 0.95} />
          </mesh>
          {/* Right Border Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.35, 0, 0]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={isNightMode ? 0.8 : 0.95} />
          </mesh>
          {/* Back Stop Line (Outer front fence border at Z = +0.55) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.55]}>
            <planeGeometry args={[0.73, 0.03]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={isNightMode ? 0.8 : 0.95} />
          </mesh>

          {/* Parked Cars */}
          {slot.hasCar && (
            <group position={[0, 0, -0.05]}>
              <mesh castShadow position={[0, 0.12, 0]}>
                <boxGeometry args={[0.35, 0.22, 0.75]} />
                <meshStandardMaterial color={slot.color} roughness={0.3} metalness={0.5} />
              </mesh>
              <mesh position={[0, 0.26, -0.05]}>
                <boxGeometry args={[0.3, 0.16, 0.42]} />
                <meshStandardMaterial color="#1E293B" roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.12, -0.38]}>
                <boxGeometry args={[0.28, 0.06, 0.02]} />
                <meshBasicMaterial color={isNightMode ? '#38BDF8' : '#FEF08A'} />
              </mesh>
              <mesh position={[0, 0.12, 0.38]}>
                <boxGeometry args={[0.28, 0.06, 0.02]} />
                <meshBasicMaterial color="#EF4444" />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* Blue "P" Parking Signboard */}
      <group position={[-0.4, 0, 3.8]}>
        <mesh castShadow position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshStandardMaterial color="#64748B" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.03]} />
          <meshStandardMaterial color="#2563EB" roughness={0.3} />
        </mesh>
      </group>

      {/* ================= ENTRANCE DRIVEWAY (Front Gate) ================= */}
      {/* Seamless Asphalt Ramp Connector extending from front street into courtyard */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-2.0, 0.026, 5.2]}>
        <planeGeometry args={[2.8, 2.0]} />
        <meshStandardMaterial color={isNightMode ? '#151A24' : '#2A2E37'} roughness={0.9} />
      </mesh>

      {/* Speed Bump at Gate Entrance (Polisi Tidur Aspal dengan Garis Kuning Miring) */}
      <group position={[-2.0, 0.03, 4.8]}>
        <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[2.7, 0.04, 0.38]} />
          <meshStandardMaterial color={isNightMode ? '#0F172A' : '#1E293B'} roughness={0.9} />
        </mesh>

        {/* Diagonal Slanted Yellow Stripes */}
        {[-1.0, -0.5, 0, 0.5, 1.0].map((offsetX, idx) => (
          <mesh
            key={`panyawangan-bump-${idx}`}
            rotation={[-Math.PI / 2, 0, Math.PI / 4]}
            position={[offsetX, 0.042, 0]}
          >
            <planeGeometry args={[0.09, 0.42]} />
            <meshBasicMaterial color="#F59E0B" />
          </mesh>
        ))}
      </group>

      {/* Entrance Gate Pillar Posts flanking the front entrance gate */}
      <group position={[-3.4, 0, 4.4]}>
        <mesh castShadow position={[0, 0.35, 0]}>
          <boxGeometry args={[0.22, 0.7, 0.22]} />
          <meshStandardMaterial color={isNightMode ? '#0F172A' : '#334155'} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={isNightMode ? '#38BDF8' : '#FEF08A'} />
        </mesh>
      </group>

      <group position={[-0.6, 0, 4.4]}>
        <mesh castShadow position={[0, 0.35, 0]}>
          <boxGeometry args={[0.22, 0.7, 0.22]} />
          <meshStandardMaterial color={isNightMode ? '#0F172A' : '#334155'} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={isNightMode ? '#38BDF8' : '#FEF08A'} />
        </mesh>
      </group>

      {/* ================= COMPACT LOW PERIMETER BASE CURBS ================= */}
      <mesh receiveShadow castShadow position={[0, 0.05, -4.4]}>
        <boxGeometry args={[8.8, 0.1, 0.1]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[-4.4, 0.05, 0.0]}>
        <boxGeometry args={[0.1, 0.1, 8.8]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[4.4, 0.05, 0.0]}>
        <boxGeometry args={[0.1, 0.1, 8.8]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>

      {/* Front Base Curb Segment 1 */}
      <mesh receiveShadow castShadow position={[-3.8, 0.05, 4.4]}>
        <boxGeometry args={[1.2, 0.1, 0.1]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>
      {/* Front Base Curb Segment 2 */}
      <mesh receiveShadow castShadow position={[1.8, 0.05, 4.4]}>
        <boxGeometry args={[4.8, 0.1, 0.1]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>

      {/* ================= TOP FENCE RAILS ================= */}
      <mesh position={[0, 0.48, -4.4]}>
        <boxGeometry args={[8.8, 0.03, 0.03]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-4.4, 0.48, 0.0]}>
        <boxGeometry args={[0.03, 0.03, 8.8]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[4.4, 0.48, 0.0]}>
        <boxGeometry args={[0.03, 0.03, 8.8]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Front Top Rail Segment 1 */}
      <mesh position={[-3.8, 0.48, 4.4]}>
        <boxGeometry args={[1.2, 0.03, 0.03]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Front Top Rail Segment 2 */}
      <mesh position={[1.8, 0.48, 4.4]}>
        <boxGeometry args={[4.8, 0.03, 0.03]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ================= VERTICAL STEEL FENCE BARS ================= */}
      {fenceBars.map((pos, idx) => (
        <mesh key={`panyawangan-bar-${idx}`} castShadow position={pos}>
          <boxGeometry args={[0.02, 0.42, 0.02]} />
          <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.9} />
        </mesh>
      ))}

      {/* ================= CORNER PILLARS ================= */}
      {cornerPillars.map(([cx, cz], idx) => (
        <group key={`panyawangan-corner-${idx}`} position={[cx, 0, cz]}>
          <mesh castShadow position={[0, 0.32, 0]}>
            <boxGeometry args={[0.22, 0.64, 0.22]} />
            <meshStandardMaterial color={isNightMode ? '#0F172A' : '#334155'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.66, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color={isNightMode ? '#38BDF8' : '#FEF08A'} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
