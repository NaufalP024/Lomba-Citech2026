import React, { useMemo } from 'react';

/**
 * BupatiFence.tsx
 * Perimeter fence surrounding Kantor Bupati (Top-Left plot [-14.5, 0, -14.5]):
 * - Compact steel railing fence retracted inside pad so road curbs stay outside
 * - Red automatic barrier gate arm (plang merah)
 * - Asphalt speed bump with diagonal yellow stripes (polisi tidur)
 * - Dedicated front parking lot row with 6 slots and 2 parked cars
 * - 2 Park Benches (tempat duduk) placed exactly along the red line annotation
 */
export const BupatiFence: React.FC = () => {

  // Perimeter steel fence bars (retracted inside pad: X: -19.1 to -9.9, Z: -19.1 to -9.9)
  const fenceBars = useMemo(() => {
    const bars: [number, number, number][] = [];
    const spacing = 0.35; // 35cm bar spacing

    // Rear fence (Z = -19.1, X from -18.9 to -10.1)
    for (let x = -18.9; x <= -10.1; x += spacing) {
      bars.push([x, 0.28, -19.1]);
    }

    // Left fence (X = -19.1, Z from -18.9 to -10.1)
    for (let z = -18.9; z <= -10.1; z += spacing) {
      bars.push([-19.1, 0.28, z]);
    }

    // Front fence (Z = -9.9, X from -18.9 to -10.1)
    for (let x = -18.9; x <= -10.1; x += spacing) {
      bars.push([x, 0.28, -9.9]);
    }

    // Right fence (X = -9.9): Open gap for Entrance Gate at Z: -13.5 to -11.0
    // Segment 1 (Z: -18.9 to -13.7)
    for (let z = -18.9; z <= -13.7; z += spacing) {
      bars.push([-9.9, 0.28, z]);
    }
    // Segment 2 (Z: -10.8 to -10.1)
    for (let z = -10.8; z <= -10.1; z += spacing) {
      bars.push([-9.9, 0.28, z]);
    }

    return bars;
  }, []);

  // Corner Pillars
  const cornerPillars = [
    [-19.1, -19.1],
    [-9.9, -19.1],
    [-19.1, -9.9],
    [-9.9, -9.9],
  ];

  // Front Parking Row (6 bays along inner front fence at Z = -10.8)
  const parkingSlots = [
    { x: -18.0, z: -10.8, hasCar: false },
    { x: -16.8, z: -10.8, hasCar: true, color: '#3B82F6' },  // Car 1: Royal Blue
    { x: -15.6, z: -10.8, hasCar: false },
    { x: -14.4, z: -10.8, hasCar: false },
    { x: -13.2, z: -10.8, hasCar: true, color: '#EF4444' },  // Car 2: Crimson Red
    { x: -12.0, z: -10.8, hasCar: false },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* ================= FRONT PARKING LOT ================= */}
      {/* Asphalt parking pad overlay along front fence */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-15.0, 0.015, -10.8]}>
        <planeGeometry args={[7.6, 1.3]} />
        <meshStandardMaterial color={'#CBD5E1'} roughness={0.8} />
      </mesh>

      {/* Parking Slots White Line Markings & Parked Cars */}
      {parkingSlots.map((slot, idx) => (
        <group key={`bupati-slot-${idx}`} position={[slot.x, 0.02, slot.z]}>
          {/* Left Border Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.38, 0, 0]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.95} />
          </mesh>
          {/* Right Border Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.38, 0, 0]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.95} />
          </mesh>
          {/* Back Stop Line (Outer front fence border at Z = +0.55) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.55]}>
            <planeGeometry args={[0.78, 0.03]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.95} />
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
                <meshBasicMaterial color={'#FEF08A'} />
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
      <group position={[-18.4, 0, -10.5]}>
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
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-9.0, 0.026, -12.2]}>
        <planeGeometry args={[2.0, 2.4]} />
        <meshStandardMaterial color={'#2A2E37'} roughness={0.9} />
      </mesh>

      {/* Speed Bump (Polisi Tidur Aspal Garis Kuning Miring) */}
      <group position={[-9.3, 0.03, -12.2]}>
        <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[0.38, 0.04, 2.2]} />
          <meshStandardMaterial color={'#1E293B'} roughness={0.9} />
        </mesh>
        {[-0.8, -0.4, 0, 0.4, 0.8].map((offsetZ, idx) => (
          <mesh
            key={`bupati-bump-${idx}`}
            rotation={[-Math.PI / 2, 0, Math.PI / 4]}
            position={[0, 0.042, offsetZ]}
          >
            <planeGeometry args={[0.09, 0.42]} />
            <meshBasicMaterial color="#F59E0B" />
          </mesh>
        ))}
      </group>

      {/* ================= AUTOMATIC RED BARRIER GATE (Plang Merah) ================= */}
      <group position={[-9.7, 0, -13.2]}>
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
      <group position={[-9.9, 0, -13.7]}>
        <mesh castShadow position={[0, 0.32, 0]}>
          <boxGeometry args={[0.22, 0.64, 0.22]} />
          <meshStandardMaterial color={'#334155'} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.66, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={'#FEF08A'} />
        </mesh>
      </group>

      <group position={[-9.9, 0, -10.8]}>
        <mesh castShadow position={[0, 0.32, 0]}>
          <boxGeometry args={[0.22, 0.64, 0.22]} />
          <meshStandardMaterial color={'#334155'} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.66, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={'#FEF08A'} />
        </mesh>
      </group>

      {/* ================= COMPACT LOW PERIMETER BASE CURBS ================= */}
      <mesh receiveShadow castShadow position={[-14.5, 0.05, -19.1]}>
        <boxGeometry args={[9.2, 0.1, 0.1]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[-19.1, 0.05, -14.5]}>
        <boxGeometry args={[0.1, 0.1, 9.2]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[-14.5, 0.05, -9.9]}>
        <boxGeometry args={[9.2, 0.1, 0.1]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>

      <mesh receiveShadow castShadow position={[-9.9, 0.05, -16.4]}>
        <boxGeometry args={[0.1, 0.1, 5.4]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[-9.9, 0.05, -10.35]}>
        <boxGeometry args={[0.1, 0.1, 0.9]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>

      {/* ================= TOP FENCE RAILS ================= */}
      <mesh position={[-14.5, 0.48, -19.1]}>
        <boxGeometry args={[9.2, 0.03, 0.03]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-19.1, 0.48, -14.5]}>
        <boxGeometry args={[0.03, 0.03, 9.2]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-14.5, 0.48, -9.9]}>
        <boxGeometry args={[9.2, 0.03, 0.03]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      <mesh position={[-9.9, 0.48, -16.4]}>
        <boxGeometry args={[0.03, 0.03, 5.4]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-9.9, 0.48, -10.35]}>
        <boxGeometry args={[0.03, 0.03, 0.9]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ================= VERTICAL STEEL FENCE BARS ================= */}
      {fenceBars.map((pos, idx) => (
        <mesh key={`bupati-bar-${idx}`} castShadow position={pos}>
          <boxGeometry args={[0.02, 0.42, 0.02]} />
          <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.9} />
        </mesh>
      ))}

      {/* ================= CORNER PILLARS ================= */}
      {cornerPillars.map(([cx, cz], idx) => (
        <group key={`bupati-corner-${idx}`} position={[cx, 0, cz]}>
          <mesh castShadow position={[0, 0.32, 0]}>
            <boxGeometry args={[0.22, 0.64, 0.22]} />
            <meshStandardMaterial color={'#334155'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.66, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color={'#FEF08A'} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
