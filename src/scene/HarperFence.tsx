import React, { useMemo } from 'react';

/**
 * HarperFence.tsx
 * Perimeter fence for Hotel Harper PWK featuring an automatic barrier gate,
 * and 2 dedicated parking lot zones matching the user's red line annotations:
 * 1) Front Parking Zone (Z = 3.6) along front fence
 * 2) Rear Parking Zone (Z = 0.9) along rear fence
 * with exactly 2 parked cars (scaled identically to MovingVehicles).
 */
export const HarperFence: React.FC = () => {

  // Vertical steel fence bars for Hotel Harper (retracted inside pad: X: -19.1 to -9.9, Z: 0.0 to 4.5)
  const fenceBars = useMemo(() => {
    const bars: [number, number, number][] = [];
    const spacing = 0.35; // 35cm bar spacing

    // Left fence (X = -19.1, Z from 0.2 to 4.3)
    for (let z = 0.2; z <= 4.3; z += spacing) {
      bars.push([-19.1, 0.28, z]);
    }

    // Front fence (Z = 4.5, X from -18.9 to -10.1)
    for (let x = -18.9; x <= -10.1; x += spacing) {
      bars.push([x, 0.28, 4.5]);
    }

    // Rear fence (Z = 0.0, separating Harper from Puskesmas, X from -18.9 to -10.1)
    for (let x = -18.9; x <= -10.1; x += spacing) {
      bars.push([x, 0.28, 0.0]);
    }

    // Right fence (X = -9.9): Open gap for Parking Entrance Gate at Z: 1.0 to 3.2
    // Segment 1 (Z: 0.2 to 0.9)
    for (let z = 0.2; z <= 0.9; z += spacing) {
      bars.push([-9.9, 0.28, z]);
    }
    // Segment 2 (Z: 3.3 to 4.3)
    for (let z = 3.3; z <= 4.3; z += spacing) {
      bars.push([-9.9, 0.28, z]);
    }

    return bars;
  }, []);

  // Corner Pillars coordinates
  const cornerPillars = [
    [-19.1, 0.0],
    [-9.9, 0.0],
    [-19.1, 4.5],
    [-9.9, 4.5],
  ];

  // Front Parking Zone (Red Line 1 along front fence at Z = 3.6)
  const frontParkingSlots = [
    { x: -13.6, z: 3.6, hasCar: true, color: '#3B82F6' }, // Car 1: Royal Blue
    { x: -12.8, z: 3.6, hasCar: false },
    { x: -12.0, z: 3.6, hasCar: false },
    { x: -11.2, z: 3.6, hasCar: false },
  ];

  // Rear Parking Zone (Red Line 2 along rear fence at Z = 0.9)
  const rearParkingSlots = [
    { x: -13.6, z: 0.9, hasCar: false },
    { x: -12.8, z: 0.9, hasCar: false },
    { x: -12.0, z: 0.9, hasCar: true, color: '#EF4444' }, // Car 2: Crimson Red
    { x: -11.2, z: 0.9, hasCar: false },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* ================= ZONE A: FRONT PARKING LOT (Red Line 1) ================= */}
      {/* Asphalt parking pad overlay */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-12.4, 0.015, 3.6]}>
        <planeGeometry args={[3.2, 1.3]} />
        <meshStandardMaterial color={'#CBD5E1'} roughness={0.8} />
      </mesh>

      {/* Front Parking Slots White Line Markings & Parked Car 1 */}
      {frontParkingSlots.map((slot, idx) => (
        <group key={`harper-front-slot-${idx}`} position={[slot.x, 0.02, slot.z]}>
          {/* Left Border Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.32, 0, 0]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.95} />
          </mesh>
          {/* Right Border Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.32, 0, 0]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.95} />
          </mesh>
          {/* Back Stop Line (Outer front fence border at Z = +0.55) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.55]}>
            <planeGeometry args={[0.67, 0.03]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.95} />
          </mesh>

          {/* Parked Car 1 (Royal Blue) */}
          {slot.hasCar && (
            <group position={[0, 0, -0.05]}>
              {/* Car Main Body */}
              <mesh castShadow position={[0, 0.12, 0]}>
                <boxGeometry args={[0.35, 0.22, 0.75]} />
                <meshStandardMaterial color={slot.color} roughness={0.3} metalness={0.5} />
              </mesh>
              {/* Car Cabin */}
              <mesh position={[0, 0.26, -0.05]}>
                <boxGeometry args={[0.3, 0.16, 0.42]} />
                <meshStandardMaterial color="#1E293B" roughness={0.1} />
              </mesh>
              {/* Headlights (Facing inward) */}
              <mesh position={[0, 0.12, -0.38]}>
                <boxGeometry args={[0.28, 0.06, 0.02]} />
                <meshBasicMaterial color={'#FEF08A'} />
              </mesh>
              {/* Taillights (Facing front fence) */}
              <mesh position={[0, 0.12, 0.38]}>
                <boxGeometry args={[0.28, 0.06, 0.02]} />
                <meshBasicMaterial color="#EF4444" />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* ================= ZONE B: REAR PARKING LOT (Red Line 2) ================= */}
      {/* Asphalt parking pad overlay */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-12.4, 0.015, 0.9]}>
        <planeGeometry args={[3.2, 1.3]} />
        <meshStandardMaterial color={'#CBD5E1'} roughness={0.8} />
      </mesh>

      {/* Rear Parking Slots White Line Markings & Parked Car 2 */}
      {rearParkingSlots.map((slot, idx) => (
        <group key={`harper-rear-slot-${idx}`} position={[slot.x, 0.02, slot.z]}>
          {/* Left Border Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.32, 0, 0]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.95} />
          </mesh>
          {/* Right Border Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.32, 0, 0]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.95} />
          </mesh>
          {/* Back Stop Line (Outer rear fence border at Z = -0.55) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.55]}>
            <planeGeometry args={[0.67, 0.03]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.95} />
          </mesh>

          {/* Parked Car 2 (Crimson Red) */}
          {slot.hasCar && (
            <group position={[0, 0, 0.05]}>
              {/* Car Main Body */}
              <mesh castShadow position={[0, 0.12, 0]}>
                <boxGeometry args={[0.35, 0.22, 0.75]} />
                <meshStandardMaterial color={slot.color} roughness={0.3} metalness={0.5} />
              </mesh>
              {/* Car Cabin */}
              <mesh position={[0, 0.26, 0.05]}>
                <boxGeometry args={[0.3, 0.16, 0.42]} />
                <meshStandardMaterial color="#1E293B" roughness={0.1} />
              </mesh>
              {/* Headlights (Facing inward) */}
              <mesh position={[0, 0.12, 0.38]}>
                <boxGeometry args={[0.28, 0.06, 0.02]} />
                <meshBasicMaterial color={'#FEF08A'} />
              </mesh>
              {/* Taillights (Facing rear fence) */}
              <mesh position={[0, 0.12, -0.38]}>
                <boxGeometry args={[0.28, 0.06, 0.02]} />
                <meshBasicMaterial color="#EF4444" />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* Blue "P" Parking Signboard for Hotel Harper */}
      <group position={[-14.2, 0, 3.9]}>
        <mesh castShadow position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshStandardMaterial color="#64748B" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.03]} />
          <meshStandardMaterial color="#2563EB" roughness={0.3} />
        </mesh>
      </group>

      {/* ================= HOTEL HARPER PARKING ENTRANCE DRIVEWAY ================= */}
      {/* Seamless Asphalt Connector Ramp extending from main street into hotel lot */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-9.0, 0.026, 2.1]}>
        <planeGeometry args={[2.0, 2.4]} />
        <meshStandardMaterial color={'#2A2E37'} roughness={0.9} />
      </mesh>

      {/* Speed Bump (Polisi Tidur Aspal Garis Kuning Miring) */}
      <group position={[-9.3, 0.03, 2.1]}>
        <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[0.38, 0.04, 2.2]} />
          <meshStandardMaterial color={'#1E293B'} roughness={0.9} />
        </mesh>
        {[-0.8, -0.4, 0, 0.4, 0.8].map((offsetZ, idx) => (
          <mesh
            key={`harper-bump-${idx}`}
            rotation={[-Math.PI / 2, 0, Math.PI / 4]}
            position={[0, 0.042, offsetZ]}
          >
            <planeGeometry args={[0.09, 0.42]} />
            <meshBasicMaterial color="#F59E0B" />
          </mesh>
        ))}
      </group>

      {/* ================= AUTOMATIC BARRIER GATE (Tiang Merah & Palang Pintu) ================= */}
      <group position={[-9.7, 0, 1.25]}>
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

      {/* Entrance Pillar Posts flanking driveway */}
      <group position={[-9.9, 0, 0.9]}>
        <mesh castShadow position={[0, 0.32, 0]}>
          <boxGeometry args={[0.22, 0.64, 0.22]} />
          <meshStandardMaterial color={'#334155'} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.66, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={'#FEF08A'} />
        </mesh>
      </group>

      <group position={[-9.9, 0, 3.3]}>
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
      <mesh receiveShadow castShadow position={[-19.1, 0.05, 2.25]}>
        <boxGeometry args={[0.1, 0.1, 4.5]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[-14.5, 0.05, 4.5]}>
        <boxGeometry args={[9.2, 0.1, 0.1]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[-14.5, 0.05, 0.0]}>
        <boxGeometry args={[9.2, 0.1, 0.1]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[-9.9, 0.05, 0.45]}>
        <boxGeometry args={[0.1, 0.1, 0.9]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>
      <mesh receiveShadow castShadow position={[-9.9, 0.05, 3.8]}>
        <boxGeometry args={[0.1, 0.1, 1.2]} />
        <meshStandardMaterial color={'#475569'} roughness={0.6} />
      </mesh>

      {/* ================= TOP FENCE RAILS ================= */}
      <mesh position={[-19.1, 0.48, 2.25]}>
        <boxGeometry args={[0.03, 0.03, 4.5]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-14.5, 0.48, 4.5]}>
        <boxGeometry args={[9.2, 0.03, 0.03]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-14.5, 0.48, 0.0]}>
        <boxGeometry args={[9.2, 0.03, 0.03]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-9.9, 0.48, 0.45]}>
        <boxGeometry args={[0.03, 0.03, 0.9]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-9.9, 0.48, 3.8]}>
        <boxGeometry args={[0.03, 0.03, 1.2]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ================= VERTICAL STEEL FENCE BARS ================= */}
      {fenceBars.map((pos, idx) => (
        <mesh key={`harper-bar-${idx}`} castShadow position={pos}>
          <boxGeometry args={[0.02, 0.42, 0.02]} />
          <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.9} />
        </mesh>
      ))}

      {/* ================= CORNER PILLARS ================= */}
      {cornerPillars.map(([cx, cz], idx) => (
        <group key={`harper-corner-${idx}`} position={[cx, 0, cz]}>
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
