import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { BuildingData } from '../types/city';
import { useCityStore } from '../store/useCityStore';
import { playHoverSound, playSelectBuildingSound } from '../utils/sound';

interface InteractiveBuildingProps {
  building: BuildingData;
  onContextMenu?: (e: React.MouseEvent, building: BuildingData) => void;
}

export const InteractiveBuilding: React.FC<InteractiveBuildingProps> = ({ building, onContextMenu }) => {
  const meshRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const selectedBuildingId = useCityStore((state) => state.selectedBuildingId);
  const hoveredBuildingId = useCityStore((state) => state.hoveredBuildingId);
  const focusedBuildingId = useCityStore((state) => state.focusedBuildingId);
  const isNightMode = useCityStore((state) => state.isNightMode);
  const soundEnabled = useCityStore((state) => state.soundEnabled);

  const selectBuilding = useCityStore((state) => state.selectBuilding);
  const hoverBuilding = useCityStore((state) => state.hoverBuilding);
  const toggleFocusMode = useCityStore((state) => state.toggleFocusMode);

  const isSelected = selectedBuildingId === building.id;
  const isHovered = hoveredBuildingId === building.id;
  const isFocused = focusedBuildingId === building.id;

  const [w, h, d] = building.dimensions;
  const halfH = h / 2;

  // Generate procedural window texture for DAY mode
  const dayWindowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#C0CBD9';
      ctx.fillRect(0, 0, 256, 256);

      const cols = 8;
      const rows = 12;
      const cellW = 256 / cols;
      const cellH = 256 / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.fillStyle = (r + c) % 5 === 0 ? '#64748B' : '#94A3B8';
          ctx.fillRect(c * cellW + 4, r * cellH + 4, cellW - 8, cellH - 8);
        }
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, Math.floor(h));
    return tex;
  }, [h]);

  // Generate procedural scattered window LIGHT DOTS for NIGHT mode
  const nightWindowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark facade wall background
      ctx.fillStyle = '#0B1120';
      ctx.fillRect(0, 0, 256, 256);

      const cols = 10;
      const rows = 16;
      const cellW = 256 / cols;
      const cellH = 256 / rows;

      // Realistic bright window light dot colors
      const litColors = ['#FFE066', '#FFB703', '#FFFFFF', '#38BDF8', '#FEF08A', '#FFD166'];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Only ~22% of windows are lit up as scattered glowing dots at night
          const seed = (r * 19 + c * 11 + Math.floor(h * 23)) % 100;
          if (seed < 22) {
            const colorIdx = (r * 3 + c * 5 + Math.floor(h)) % litColors.length;
            ctx.fillStyle = litColors[colorIdx];
            // Crisp, small window light dot shape
            ctx.fillRect(c * cellW + 6, r * cellH + 5, cellW - 12, cellH - 10);
          } else {
            // Dark unlit wall / window pane
            ctx.fillStyle = '#0B1120';
            ctx.fillRect(c * cellW + 6, r * cellH + 5, cellW - 12, cellH - 10);
          }
        }
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, Math.floor(h));
    return tex;
  }, [h]);

  // Animate building selection glow and night mode window emissive intensity
  useFrame((state) => {
    if (!materialRef.current) return;
    const t = state.clock.getElapsedTime();

    if (isNightMode) {
      if (isSelected) {
        const glowIntensity = 0.6 + Math.sin(t * 4) * 0.25;
        materialRef.current.emissive.set('#00D8FF');
        materialRef.current.emissiveIntensity = glowIntensity + 0.4;
      } else if (isHovered) {
        materialRef.current.emissive.set('#3B82F6');
        materialRef.current.emissiveIntensity = 0.5;
      } else {
        // High emissive intensity so ONLY the scattered lit window dots sparkle intensely!
        materialRef.current.emissive.set('#FFFFFF');
        materialRef.current.emissiveIntensity = 1.2;
      }
    } else {
      if (isSelected) {
        const glowIntensity = 0.5 + Math.sin(t * 4) * 0.25;
        materialRef.current.emissive.set('#00D8FF');
        materialRef.current.emissiveIntensity = glowIntensity;
      } else if (isHovered) {
        materialRef.current.emissive.set('#3B82F6');
        materialRef.current.emissiveIntensity = 0.3;
      } else {
        materialRef.current.emissive.set('#000000');
        materialRef.current.emissiveIntensity = 0;
      }
    }

    // Scale animation for hover & focus
    if (meshRef.current) {
      const targetScale = isHovered ? 1.015 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    selectBuilding(building.id);
    playSelectBuildingSound(soundEnabled);
  };

  const handleDoubleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    toggleFocusMode(building.id);
  };

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    hoverBuilding(building.id);
    playHoverSound(soundEnabled);
  };

  const handlePointerOut = () => {
    hoverBuilding(null);
  };

  return (
    <group
      ref={meshRef}
      position={[building.position[0], halfH, building.position[2]]}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onContextMenu={(e) => onContextMenu && onContextMenu(e as unknown as React.MouseEvent, building)}
    >
      {/* Primary Building Mesh */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          ref={materialRef}
          color={isNightMode ? '#0F172A' : (isSelected ? '#7DD3FC' : building.color || '#D1DBE5')}
          map={isNightMode ? nightWindowTexture : dayWindowTexture}
          emissiveMap={isNightMode ? nightWindowTexture : undefined}
          roughness={0.4}
          metalness={0.1}
          transparent={focusedBuildingId !== null && !isFocused}
          opacity={focusedBuildingId !== null && !isFocused ? 0.35 : 1.0}
        />
      </mesh>

      {/* Selected Edge Highlight Wireframe / Emissive Cage */}
      {isSelected && (
        <lineSegments position={[0, 0, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(w + 0.05, h + 0.05, d + 0.05)]} />
          <lineBasicMaterial color="#00D8FF" linewidth={2.5} />
        </lineSegments>
      )}

      {/* Rooftop Structures */}
      <group position={[0, halfH, 0]}>
        {/* Parapet border */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[w, 0.2, d]} />
          <meshStandardMaterial color={isNightMode ? '#1E293B' : '#94A3B8'} roughness={0.4} />
        </mesh>

        {/* Helipad */}
        {building.roofType === 'helipad' && (
          <group position={[0, 0.2, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[Math.min(w, d) * 0.38, 32]} />
              <meshBasicMaterial color="#334155" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
              <ringGeometry args={[Math.min(w, d) * 0.32, Math.min(w, d) * 0.36, 32]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
          </group>
        )}

        {/* HVAC Chillers */}
        {building.roofType === 'hvac' && (
          <group position={[0, 0.3, 0]}>
            {[-0.6, 0.6].map((xOffset, i) => (
              <mesh key={`hvac-${i}`} position={[xOffset, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.5, 16]} />
                <meshStandardMaterial color="#64748B" metalness={0.7} />
              </mesh>
            ))}
          </group>
        )}

        {/* Solar Panels */}
        {building.roofType === 'solar' && (
          <group position={[0, 0.25, 0]} rotation={[0.2, 0, 0]}>
            <mesh>
              <boxGeometry args={[w * 0.7, 0.08, d * 0.7]} />
              <meshStandardMaterial color="#1E3A8A" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        )}

        {/* Spire Antenna */}
        {building.roofType === 'spire' && (
          <group position={[0, 0.2, 0]}>
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.03, 0.12, 2.4, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
            <mesh position={[0, 2.4, 0]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshBasicMaterial color="#00D8FF" />
            </mesh>
          </group>
        )}
      </group>

      {/* Building Status Light Beacon */}
      <mesh position={[0, halfH + 0.3, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshBasicMaterial
          color={
            building.status === 'Critical'
              ? '#EF4444'
              : building.status === 'Warning'
              ? '#F59E0B'
              : building.status === 'Maintenance'
              ? '#3B82F6'
              : '#34D399'
          }
        />
      </mesh>

      {/* Compact Sleek Hover Tooltip Badge */}
      {isHovered && !isSelected && (
        <Html position={[0, halfH + 1.2, 0]} center distanceFactor={22} style={{ pointerEvents: 'none' }}>
          <div className="bg-slate-900/90 text-white font-sans backdrop-blur-md px-3 py-1 rounded-full shadow-xl border border-blue-400/40 text-[11px] font-semibold whitespace-nowrap flex items-center space-x-1.5 animate-in fade-in zoom-in-95 duration-150">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span className="text-blue-300 font-mono">{building.code}</span>
            <span className="text-slate-100">{building.name}</span>
          </div>
        </Html>
      )}
    </group>
  );
};
