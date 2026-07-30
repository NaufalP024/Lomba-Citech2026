import React, { useMemo } from 'react';

/**
 * PrimePlazaFence.tsx
 * Compact perimeter fence for Prime Plaza PWK with retracted front fence (Z = 18.7)
 * ensuring the street sidewalk/curb (trotoar) remains 100% OUTSIDE the fence line.
 * Features red automatic barrier gate arm and end-to-end parking lot with 5 parked cars.
 */
export const PrimePlazaFence: React.FC = () => {

  // Perimeter steel fence bars (retracted inside pad: X: -4.4 to 4.4, Z: 10.1 to 18.7)
  const fenceBars = useMemo(() => {
    const bars: [number, number, number][] = [];
    const spacing = 0.35; // 35cm bar spacing

    // Rear fence (Z = 10.1, X from -4.2 to 4.2)
    for (let x = -4.2; x <= 4.2; x += spacing) {
      bars.push([x, 0.28, 10.1]);
    }

    // Left fence (X = -4.4, Z from 10.3 to 18.5)
    for (let z = 10.3; z <= 18.5; z += spacing) {
      bars.push([-4.4, 0.28, z]);
    }

    // Front fence (Z = 18.7 - Retracted so trotoar is 100% OUTSIDE fence line!)
    for (let x = -4.2; x <= 4.2; x += spacing) {
      bars.push([x, 0.28, 18.7]);
    }

    // Right fence (X = 4.4): Open gap for Entrance Gate at Z: 12.0 to 14.5
    // Segment 1 (Z: 10.3 to 11.8)
    for (let z = 10.3; z <= 11.8; z += spacing) {
      bars.push([4.4, 0.28, z]);
    }
    // Segment 2 (Z: 14.7 to 18.5)
    for (let z = 14.7; z <= 18.5; z += spacing) {
      bars.push([4.4, 0.28, z]);
    }

    return bars;
  }, []);

  // Corner Pillars
  const cornerPillars = [
    [-4.4, 10.1],
    [4.4, 10.1],
    [-4.4, 18.7],
    [4.4, 18.7],
  ];

  // End-to-End Front Parking Row (8 bays spanning X = -3.6 to 3.4 along front fence Z = 17.8)
  const frontParkingSlots = [
    { x: -3.6, z: 17.8, hasCar: true, color: '#3B82F6' },  // Car 1: Royal Blue
    { x: -2.6, z: 17.8, hasCar: false },                   // Empty slot
    { x: -1.6, z: 17.8, hasCar: true, color: '#EF4444' },  // Car 2: Crimson Red
    { x: -0.6, z: 17.8, hasCar: false },                   // Empty slot
    { x: 0.4, z: 17.8, hasCar: true, color: '#F59E0B' },    // Car 3: Amber Yellow
    { x: 1.4, z: 17.8, hasCar: false },                    // Empty slot
    { x: 2.4, z: 17.8, hasCar: true, color: '#10B981' },   // Car 4: Emerald Green
    { x: 3.4, z: 17.8, hasCar: true, color: '#06B6D4' },   // Car 5: Cyan
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* ================= END-TO-END FRONT PARKING LOT ================= */}
      {/* End-to-End Asphalt Pad Overlay along front fence */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-0.1, 0.015, 17.8]}>
        <planeGeometry args={[7.6, 1.3]} />
        <meshStandardMaterial color={'#CBD5E1'} roughness={0.8} />
      </mesh>

      {/* Parking Bays Line Markings & 5 Parked Cars */}
      {frontParkingSlots.map((slot, idx) => (
        <group key={`plaza-front-slot-${idx}`} position={[slot.x, 0.02, slot.z]}>
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
          {/* Back Stop Line (Inner fence stop line at Z = +0.55) */}
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
      <group position={[4.0, 0, 18.1]}>
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
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[5.2, 0.026, 13.2]}>
        <planeGeometry args={[2.0, 2.4]} />
        <meshStandardMaterial color={'#2A2E37'} roughness={0.9} />
      </mesh>

      {/* ================= AUTOMATIC RED BARRIER GATE (Plang Masuk Warna Merah) ================= */}
      <group position={[4.4, 0, 12.2]}>
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
      <group position={[4.4, 0, 11.8]}>
        <mesh castShadow position={[0, 0.32, 0]}>
          <boxGeometry args={[0.22, 0.64, 0.22]} />
          <meshStandardMaterial color={'#334155'} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.66, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={'#FEF08A'} />
        </mesh>
      </group>

      <group position={[4.4, 0, 14.7]}>
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
      <mesh receiveShadow castShadow position={[0, 0.05, 10.1]}>
        <boxGeometry args={[8.8, 0.1, 0.1]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[-4.4, 0.05, 14.4]}>
        <boxGeometry args={[0.1, 0.1, 8.6]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[0, 0.05, 18.7]}>
        <boxGeometry args={[8.8, 0.1, 0.1]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>

      <mesh receiveShadow castShadow position={[4.4, 0.05, 11.05]}>
        <boxGeometry args={[0.1, 0.1, 1.7]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[4.4, 0.05, 16.6]}>
        <boxGeometry args={[0.1, 0.1, 3.8]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>

      {/* ================= TOP FENCE RAILS ================= */}
      <mesh position={[0, 0.48, 10.1]}>
        <boxGeometry args={[8.8, 0.03, 0.03]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-4.4, 0.48, 14.4]}>
        <boxGeometry args={[0.03, 0.03, 8.6]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.48, 18.7]}>
        <boxGeometry args={[8.8, 0.03, 0.03]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      <mesh position={[4.4, 0.48, 11.05]}>
        <boxGeometry args={[0.03, 0.03, 1.7]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[4.4, 0.48, 16.6]}>
        <boxGeometry args={[0.03, 0.03, 3.8]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ================= VERTICAL STEEL FENCE BARS ================= */}
      {fenceBars.map((pos, idx) => (
        <mesh key={`plaza-bar-${idx}`} castShadow position={pos}>
          <boxGeometry args={[0.02, 0.42, 0.02]} />
          <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.9} />
        </mesh>
      ))}

      {/* ================= CORNER PILLARS ================= */}
      {cornerPillars.map(([cx, cz], idx) => (
        <group key={`plaza-corner-${idx}`} position={[cx, 0, cz]}>
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
