import React from 'react';
import { useCityStore } from '../store/useCityStore';

/**
 * CampusParkingLot.tsx
 * End-to-end parking lot along the front fence for Politeknik Enjinering Indorama
 * featuring 11 parking bays spanning from left fence to right fence,
 * with exactly 1 parked car (scaled identically to MovingVehicles).
 */
export const CampusParkingLot: React.FC = () => {
  const isNightMode = useCityStore((state) => state.isNightMode);

  // 11 Parking bays spanning end-to-end along the front fence (Z = 18.5)
  const carSlots = [
    { x: -18.6, z: 18.5, hasCar: false },
    { x: -17.8, z: 18.5, hasCar: false },
    { x: -17.0, z: 18.5, hasCar: false },
    { x: -16.2, z: 18.5, hasCar: false },
    { x: -15.4, z: 18.5, hasCar: false },
    { x: -14.6, z: 18.5, hasCar: true, color: '#3B82F6' }, // Exactly 1 parked car (Royal Blue, matching moving cars)
    { x: -13.8, z: 18.5, hasCar: false },
    { x: -13.0, z: 18.5, hasCar: false },
    { x: -12.2, z: 18.5, hasCar: false },
    { x: -11.4, z: 18.5, hasCar: false },
    { x: -10.6, z: 18.5, hasCar: false },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* End-to-end asphalt parking pad overlay along the front fence */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-14.6, 0.015, 18.5]}>
        <planeGeometry args={[9.0, 1.4]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#CBD5E1'} roughness={0.8} />
      </mesh>

      {/* Car Parking Slots White Line Markings (End-to-End along front fence) */}
      {carSlots.map((slot, idx) => (
        <group key={`campus-car-slot-${idx}`} position={[slot.x, 0.02, slot.z]}>
          {/* Left Border Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.32, 0, 0]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={isNightMode ? 0.8 : 0.95} />
          </mesh>
          {/* Right Border Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.32, 0, 0]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={isNightMode ? 0.8 : 0.95} />
          </mesh>
          {/* Back Stop Line (Touching front fence border at Z = +0.55) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.55]}>
            <planeGeometry args={[0.67, 0.03]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={isNightMode ? 0.8 : 0.95} />
          </mesh>

          {/* Exactly 1 Parked Car Mesh inside Slot 6 (Matching MovingVehicles scale) */}
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
              {/* Headlights (Facing inward toward campus) */}
              <mesh position={[0, 0.12, -0.38]}>
                <boxGeometry args={[0.28, 0.06, 0.02]} />
                <meshBasicMaterial color={isNightMode ? '#38BDF8' : '#FEF08A'} />
              </mesh>
              {/* Taillights (Facing front fence/street) */}
              <mesh position={[0, 0.12, 0.38]}>
                <boxGeometry args={[0.28, 0.06, 0.02]} />
                <meshBasicMaterial color="#EF4444" />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* Blue "P" Parking Signboard near left fence corner */}
      <group position={[-18.8, 0, 18.9]}>
        <mesh castShadow position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshStandardMaterial color="#64748B" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.03]} />
          <meshStandardMaterial color="#2563EB" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};
