import React, { useMemo } from 'react';
import { useCityStore } from '../store/useCityStore';

/**
 * DisnakerFence.tsx
 * Perimeter fence surrounding Disnaker Purwakarta (Middle-Right plot [14.5, 0, 0]):
 * - Steel railing fence retracted inside pad boundary (X: 10.1 to 18.8, Z: -4.4 to 4.4)
 *   so that the outer sidewalk/trotoar remains 100% outside the fence perimeter.
 * - Red automatic barrier gate arm (plang merah)
 * - Asphalt speed bump with diagonal yellow stripes (polisi tidur)
 * - 2 Parking Zones (Zone 1 Front Row & Zone 2 Side/Rear Row) with parked cars
 */
export const DisnakerFence: React.FC = () => {
  const isNightMode = useCityStore((state) => state.isNightMode);

  // Perimeter steel fence bars (retracted inside pad: X: 10.1 to 18.8, Z: -4.4 to 4.4)
  const fenceBars = useMemo(() => {
    const bars: [number, number, number][] = [];
    const spacing = 0.35; // 35cm bar spacing

    // Rear fence (Z = -4.4, X from 10.3 to 18.6)
    for (let x = 10.3; x <= 18.6; x += spacing) {
      bars.push([x, 0.28, -4.4]);
    }

    // Right fence (X = 18.8, Z from -4.2 to 4.2)
    for (let z = -4.2; z <= 4.2; z += spacing) {
      bars.push([18.8, 0.28, z]);
    }

    // Front fence (Z = 4.4, X from 10.3 to 18.6)
    for (let x = 10.3; x <= 18.6; x += spacing) {
      bars.push([x, 0.28, 4.4]);
    }

    // Left fence (X = 10.1): Open gap for Entrance Gate at Z: -1.2 to 1.3
    // Segment 1 (Z: -4.2 to -1.4)
    for (let z = -4.2; z <= -1.4; z += spacing) {
      bars.push([10.1, 0.28, z]);
    }
    // Segment 2 (Z: 1.5 to 4.2)
    for (let z = 1.5; z <= 4.2; z += spacing) {
      bars.push([10.1, 0.28, z]);
    }

    return bars;
  }, []);

  // Corner Pillars
  const cornerPillars = [
    [10.1, -4.4],
    [18.8, -4.4],
    [10.1, 4.4],
    [18.8, 4.4],
  ];

  // Front Parking Row (Zone 1 along inner front fence at Z = 3.75)
  const frontParkingSlots = [
    { x: 12.0, z: 3.75, hasCar: true, color: '#F59E0B' },  // Car 1: Amber Gold
    { x: 13.2, z: 3.75, hasCar: false },
    { x: 14.4, z: 3.75, hasCar: false },
    { x: 15.6, z: 3.75, hasCar: true, color: '#10B981' },  // Car 2: Emerald Green
    { x: 16.8, z: 3.75, hasCar: false },
    { x: 18.0, z: 3.75, hasCar: false },
  ];

  // Side/Rear Parking Row (Zone 2 along right inner fence at X = 18.15 touching the rear fence)
  const sideParkingSlots = [
    { x: 18.15, z: -3.75, hasCar: false },
    { x: 18.15, z: -2.55, hasCar: true, color: '#DC2626' },  // Car 3: Crimson Red
    { x: 18.15, z: -1.35, hasCar: false },
    { x: 18.15, z: -0.15, hasCar: false },
    { x: 18.15, z: 1.05, hasCar: true, color: '#3B82F6' },   // Car 4: Royal Blue
    { x: 18.15, z: 2.25, hasCar: false },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* ================= FRONT PARKING LOT (ZONE 1) ================= */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[15.0, 0.015, 3.75]}>
        <planeGeometry args={[7.6, 1.3]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#CBD5E1'} roughness={0.8} />
      </mesh>

      {/* Front Parking Slots White Line Markings & Parked Cars */}
      {frontParkingSlots.map((slot, idx) => (
        <group key={`disnaker-front-slot-${idx}`} position={[slot.x, 0.02, slot.z]}>
          {/* Left Border Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.38, 0, 0]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={isNightMode ? 0.8 : 0.95} />
          </mesh>
          {/* Right Border Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.38, 0, 0]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={isNightMode ? 0.8 : 0.95} />
          </mesh>
          {/* Back Stop Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.55]}>
            <planeGeometry args={[0.78, 0.03]} />
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

      {/* ================= SIDE/REAR PARKING LOT (ZONE 2) ================= */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[18.15, 0.015, -0.75]}>
        <planeGeometry args={[1.3, 7.6]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#CBD5E1'} roughness={0.8} />
      </mesh>

      {/* Side Parking Slots White Line Markings & Parked Cars */}
      {sideParkingSlots.map((slot, idx) => (
        <group key={`disnaker-side-slot-${idx}`} position={[slot.x, 0.02, slot.z]} rotation={[0, Math.PI / 2, 0]}>
          {/* Top Border Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.38, 0, 0]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={isNightMode ? 0.8 : 0.95} />
          </mesh>
          {/* Bottom Border Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.38, 0, 0]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={isNightMode ? 0.8 : 0.95} />
          </mesh>
          {/* Back Stop Line (Outer right fence border) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.55]}>
            <planeGeometry args={[0.78, 0.03]} />
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
      <group position={[10.5, 0, 3.5]}>
        <mesh castShadow position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshStandardMaterial color="#64748B" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.03]} />
          <meshStandardMaterial color="#2563EB" roughness={0.3} />
        </mesh>
      </group>

      {/* ================= ENTRANCE DRIVEWAY ================= */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[9.2, 0.026, 0.0]}>
        <planeGeometry args={[1.8, 2.4]} />
        <meshStandardMaterial color={isNightMode ? '#151A24' : '#2A2E37'} roughness={0.9} />
      </mesh>

      {/* Speed Bump (Polisi Tidur Aspal Garis Kuning Miring) */}
      <group position={[9.3, 0.03, 0.0]}>
        <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[0.38, 0.04, 2.2]} />
          <meshStandardMaterial color={isNightMode ? '#0F172A' : '#1E293B'} roughness={0.9} />
        </mesh>
        {[-0.8, -0.4, 0, 0.4, 0.8].map((offsetZ, idx) => (
          <mesh
            key={`disnaker-bump-${idx}`}
            rotation={[-Math.PI / 2, 0, Math.PI / 4]}
            position={[0, 0.042, offsetZ]}
          >
            <planeGeometry args={[0.09, 0.42]} />
            <meshBasicMaterial color="#F59E0B" />
          </mesh>
        ))}
      </group>

      {/* ================= AUTOMATIC RED BARRIER GATE (Plang Merah) ================= */}
      <group position={[9.9, 0, -0.9]}>
        {/* Red Cabinet */}
        <mesh castShadow position={[0, 0.42, 0]}>
          <boxGeometry args={[0.22, 0.84, 0.22]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
        {/* Barrier Arm (Red-White Stripe) */}
        <mesh position={[0, 0.68, 0.85]}>
          <boxGeometry args={[0.05, 0.05, 1.6]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} />
        </mesh>
      </group>

      {/* Entrance Pillar Posts */}
      <group position={[10.1, 0, -1.4]}>
        <mesh castShadow position={[0, 0.32, 0]}>
          <boxGeometry args={[0.22, 0.64, 0.22]} />
          <meshStandardMaterial color={isNightMode ? '#0F172A' : '#334155'} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.66, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={isNightMode ? '#38BDF8' : '#FEF08A'} />
        </mesh>
      </group>

      <group position={[10.1, 0, 1.5]}>
        <mesh castShadow position={[0, 0.32, 0]}>
          <boxGeometry args={[0.22, 0.64, 0.22]} />
          <meshStandardMaterial color={isNightMode ? '#0F172A' : '#334155'} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.66, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={isNightMode ? '#38BDF8' : '#FEF08A'} />
        </mesh>
      </group>

      {/* ================= COMPACT LOW PERIMETER BASE CURBS ================= */}
      <mesh receiveShadow castShadow position={[14.45, 0.05, -4.4]}>
        <boxGeometry args={[8.7, 0.1, 0.1]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[18.8, 0.05, 0.0]}>
        <boxGeometry args={[0.1, 0.1, 8.7]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[14.45, 0.05, 4.4]}>
        <boxGeometry args={[8.7, 0.1, 0.1]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>

      <mesh receiveShadow castShadow position={[10.1, 0.05, -2.8]}>
        <boxGeometry args={[0.1, 0.1, 3.0]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[10.1, 0.05, 2.85]}>
        <boxGeometry args={[0.1, 0.1, 2.9]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.6} />
      </mesh>

      {/* ================= TOP FENCE RAILS ================= */}
      <mesh position={[14.45, 0.48, -4.4]}>
        <boxGeometry args={[8.7, 0.03, 0.03]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[18.8, 0.48, 0.0]}>
        <boxGeometry args={[0.03, 0.03, 8.7]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[14.45, 0.48, 4.4]}>
        <boxGeometry args={[8.7, 0.03, 0.03]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      <mesh position={[10.1, 0.48, -2.8]}>
        <boxGeometry args={[0.03, 0.03, 3.0]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[10.1, 0.48, 2.85]}>
        <boxGeometry args={[0.03, 0.03, 2.9]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ================= VERTICAL STEEL FENCE BARS ================= */}
      {fenceBars.map((pos, idx) => (
        <mesh key={`disnaker-bar-${idx}`} castShadow position={pos}>
          <boxGeometry args={[0.02, 0.42, 0.02]} />
          <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.9} />
        </mesh>
      ))}

      {/* ================= CORNER PILLARS ================= */}
      {cornerPillars.map(([cx, cz], idx) => (
        <group key={`disnaker-corner-${idx}`} position={[cx, 0, cz]}>
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
