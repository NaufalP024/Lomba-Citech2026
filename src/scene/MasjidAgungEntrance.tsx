import React from 'react';
import { Html } from '@react-three/drei';
import { useCityStore } from '../store/useCityStore';

/**
 * MasjidAgungEntrance.tsx
 * Open Entrance Driveway & Emerald-Gold Welcome Signboard for Masjid Agung Purwakarta (plot [14.5, 0, 14.5]):
 * - Smooth entrance driveway cut connecting the main road Z: 9.7 to the mosque pavingblock courtyard Z: 12.2
 * - Tactile yellow guiding blocks (guiding block pejalan kaki)
 * - Modern Emerald & Gold "MASJID AGUNG PURWAKARTA" welcome signboard totem with crescent moon dome crest
 * - 100% open layout WITHOUT fences
 */
export const MasjidAgungEntrance: React.FC = () => {
  const isNightMode = useCityStore((state) => state.isNightMode);

  return (
    <group position={[14.5, 0, 14.5]}>
      {/* ================= ENTRANCE ACCESS DRIVEWAY ================= */}
      {/* Asphalt Entrance Driveway (Z: -4.8 to -2.3 relative to plot center [14.5, 0, 14.5]) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, -3.55]}>
        <planeGeometry args={[3.2, 2.5]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#334155'} roughness={0.8} />
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
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#64748B'} roughness={0.5} />
      </mesh>
      <mesh position={[1.75, 0.06, -3.55]}>
        <boxGeometry args={[0.2, 0.12, 2.5]} />
        <meshStandardMaterial color={isNightMode ? '#1E293B' : '#64748B'} roughness={0.5} />
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
            <meshBasicMaterial color={isNightMode ? '#38BDF8' : '#FEF08A'} />
          </mesh>
        </group>
      ))}

      {/* ================= EMERALD & GOLD MASJID AGUNG SIGNBOARD TOTEM ================= */}
      <group position={[-2.2, 0, -3.8]} rotation={[0, Math.PI / 12, 0]}>
        {/* Stone Pedestal Base */}
        <mesh castShadow position={[0, 0.15, 0]}>
          <boxGeometry args={[0.9, 0.3, 0.35]} />
          <meshStandardMaterial color={isNightMode ? '#0F172A' : '#334155'} roughness={0.4} />
        </mesh>

        {/* Emerald Green Main Sign Board */}
        <mesh castShadow position={[0, 0.75, 0]}>
          <boxGeometry args={[0.8, 0.9, 0.12]} />
          <meshStandardMaterial color="#065F46" roughness={0.25} metalness={0.3} />
        </mesh>

        {/* Gold Frame Border */}
        <mesh position={[0, 0.75, 0.065]}>
          <boxGeometry args={[0.76, 0.86, 0.01]} />
          <meshStandardMaterial color="#D97706" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Inner Emerald Panel */}
        <mesh position={[0, 0.75, 0.07]}>
          <boxGeometry args={[0.7, 0.8, 0.01]} />
          <meshStandardMaterial color="#047857" roughness={0.3} />
        </mesh>

        {/* Gold Crescent Moon Emblem Top Crest */}
        <group position={[0, 1.28, 0]}>
          <mesh castShadow>
            <torusGeometry args={[0.1, 0.022, 12, 24, Math.PI * 1.4]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0.04, 0.04, 0]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#FBBF24" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>

        {/* 3D HTML Text Label on Signboard */}
        <Html
          position={[0, 0.75, 0.08]}
          transform
          distanceFactor={6}
          occlude="blending"
          className="pointer-events-none select-none"
        >
          <div className="flex flex-col items-center justify-center text-center px-2 py-1 bg-emerald-950/80 backdrop-blur-md rounded-lg border border-amber-400/50 shadow-lg min-w-[120px]">
            <span className="text-[10px] tracking-wider text-amber-300 font-bold uppercase leading-tight">
              🕌 MASJID AGUNG
            </span>
            <span className="text-[8px] tracking-widest text-emerald-100 font-medium uppercase mt-0.5">
              PURWAKARTA
            </span>
          </div>
        </Html>
      </group>
    </group>
  );
};
