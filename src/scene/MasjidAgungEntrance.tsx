import React from 'react';

/**
 * MasjidAgungEntrance.tsx
 * Open Entrance Driveway for Masjid Agung Purwakarta (plot [14.5, 0, 14.5]):
 * - Smooth entrance driveway cut connecting the main road Z: 9.7 to the mosque pavingblock courtyard Z: 12.2
 * - Tactile yellow guiding blocks (guiding block pejalan kaki)
 * - 100% open layout WITHOUT fences
 */
export const MasjidAgungEntrance: React.FC = () => {

  return (
    <group position={[14.5, 0, 14.5]}>
      {/* ================= ENTRANCE ACCESS DRIVEWAY ================= */}
      {/* Asphalt Entrance Driveway (Z: -4.8 to -2.3 relative to plot center [14.5, 0, 14.5]) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, -3.55]}>
        <planeGeometry args={[3.2, 2.5]} />
        <meshStandardMaterial color={'#334155'} roughness={0.8} />
      </mesh>

      {/* Yellow Tactile Guiding Blocks (Ubin Pemandu Disabilitas / Guiding Block) */}
      <group position={[0, 0.028, -4.6]}>
        {[-1.2, -0.6, 0, 0.6, 1.2].map((xOffset, idx) => (
          <mesh key={`guiding-tile-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[xOffset, 0, 0]}>
            <planeGeometry args={[0.45, 0.25]} />
            <meshBasicMaterial color="#EAB308" />
          </mesh>
        ))}
      </group>

      {/* Side Decorative Low Planter Curb Ramp Edges */}
      <mesh position={[-1.75, 0.06, -3.55]}>
        <boxGeometry args={[0.2, 0.12, 2.5]} />
        <meshStandardMaterial color={'#64748B'} roughness={0.5} />
      </mesh>
      <mesh position={[1.75, 0.06, -3.55]}>
        <boxGeometry args={[0.2, 0.12, 2.5]} />
        <meshStandardMaterial color={'#64748B'} roughness={0.5} />
      </mesh>

      {/* Low Ground Entrance Accent Lights */}
      {[-1.75, 1.75].map((xPos, idx) => (
        <group key={`entrance-light-${idx}`} position={[xPos, 0.12, -4.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.16, 8]} />
            <meshStandardMaterial color="#475569" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color={'#FEF08A'} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
