import React, { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { BuildingData } from '../types/city';
import { useCityStore } from '../store/useCityStore';
import { playHoverSound, playSelectBuildingSound } from '../utils/sound';

interface InteractiveBuildingProps {
  building: BuildingData;
  onContextMenu?: (e: React.MouseEvent, building: BuildingData) => void;
}

// Error boundary to catch missing/corrupted GLTF model loading failures and prevent white screen crashes
class GLTFErrorBoundary extends React.Component<{ fallback: React.ReactNode; children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('GLTF load failed, activating fallback mesh:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Custom Sub-Component to render GLTF/GLB 3D Building Models with Auto-Scale, Unchanged Building Colors & Night Mode Yellow Window Lights
const GLTFModelRenderer: React.FC<{
  url: string;
  isNightMode: boolean;
  isSelected: boolean;
  isHovered: boolean;
  targetDimensions: [number, number, number];
  nightWindowTexture: THREE.CanvasTexture;
}> = React.memo(({ url, isNightMode, isSelected, isHovered, targetDimensions, nightWindowTexture }) => {
  const { scene } = useGLTF(url);
  const [targetW, targetH, targetD] = targetDimensions;

  // Store mesh material references to dynamically animate selection color and night window lights
  const meshMaterialsRef = useRef<
    { mesh: THREE.Mesh; origColor: THREE.Color; isWindowMesh: boolean }[]
  >([]);

  const { clonedScene, scaleFactor, offsetX, offsetY, offsetZ } = useMemo(() => {
    const cloned = scene.clone(true);
    meshMaterialsRef.current = [];

    // Compute original bounding box of the loaded GLTF model
    const bbox = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const center = new THREE.Vector3();
    bbox.getCenter(center);

    let scaleFactor: number;
    if (url.includes('rumah_sakit') || url.includes('hospital')) {
      const scaleX = (targetW * 1.25) / (size.x || 1);
      const scaleZ = (targetD * 1.3) / (size.z || 1);
      const scaleY = (targetH * 1.3) / (size.y || 1);
      scaleFactor = Math.min(scaleX, scaleZ, scaleY);
    } else if (url.includes('harper')) {
      const scaleY = (targetH * 1.45) / (size.y || 1);
      const scaleXZ = Math.max((targetW * 1.35) / (size.x || 1), (targetD * 1.35) / (size.z || 1));
      scaleFactor = Math.min(scaleY, scaleXZ);
    } else if (url.includes('wikara')) {
      // Balanced scaling for Politeknik Enjinering Indorama
      const scaleX = (targetW * 1.05) / (size.x || 1);
      const scaleZ = (targetD * 1.05) / (size.z || 1);
      const scaleY = (targetH * 1.05) / (size.y || 1);
      scaleFactor = Math.min(scaleX, scaleZ, scaleY);
    } else if (url.includes('bupati')) {
      // Grand scaling for Kantor Bupati as sole government center landmark
      const scaleX = (targetW * 1.3) / (size.x || 1);
      const scaleZ = (targetD * 1.3) / (size.z || 1);
      const scaleY = (targetH * 1.2) / (size.y || 1);
      scaleFactor = Math.min(scaleX, scaleZ, scaleY);
    } else if (url.includes('masjid')) {
      // Grand scaling for Masjid Agung Purwakarta landmark
      const scaleX = (targetW * 1.15) / (size.x || 1);
      const scaleZ = (targetD * 1.15) / (size.z || 1);
      const scaleY = (targetH * 1.1) / (size.y || 1);
      scaleFactor = Math.min(scaleX, scaleZ, scaleY);
    } else {
      // Original grand scaling formula for all buildings
      const scaleY = targetH / (size.y || 1);
      const scaleXZ = Math.max(targetW / (size.x || 1), targetD / (size.z || 1));
      scaleFactor = Math.min(scaleY * 1.05, scaleXZ * 1.15);
    }

    // Align base of GLTF model to ground level
    const offsetX = -center.x * scaleFactor;
    let offsetY = -bbox.min.y * scaleFactor - targetH / 2;
    const offsetZ = -center.z * scaleFactor;

    // Elevate Pasar Rebo model slightly so it never dips below ground level
    if (url.includes('pasar') || url.includes('market')) {
      offsetY += 0.35;
    }

    let index = 0;
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.roughness = 0.35;
          mat.metalness = 0.2;
          mesh.material = mat;

          const nameLower = (mesh.name + ' ' + (mat.name || '')).toLowerCase();
          // Detect window/glass elements or alternating meshes for scattered window lighting
          const isWindowMesh =
            nameLower.includes('window') ||
            nameLower.includes('glass') ||
            nameLower.includes('kaca') ||
            nameLower.includes('jendela') ||
            nameLower.includes('light') ||
            index % 3 === 0;

          meshMaterialsRef.current.push({
            mesh,
            origColor: mat.color.clone(),
            isWindowMesh,
          });
          index++;
        }
      }
    });

    return { clonedScene: cloned, scaleFactor, offsetX, offsetY, offsetZ };
  }, [scene, targetW, targetH, targetD]);

  // Animate material color dynamically on frame update when clicked (isSelected) or hovered or night mode
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshMaterialsRef.current.forEach(({ mesh, origColor, isWindowMesh }) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat) return;

      if (isSelected) {
        // Bright cyan/blue selection tint on click
        mat.color.set('#7DD3FC');
        const glow = 0.6 + Math.sin(t * 5) * 0.3;
        mat.emissive.set('#00D8FF');
        mat.emissiveMap = null;
        mat.emissiveIntensity = glow;
      } else if (isHovered) {
        // Soft blue hover tint
        mat.color.set('#93C5FD');
        mat.emissive.set('#3B82F6');
        mat.emissiveMap = null;
        mat.emissiveIntensity = 0.4;
      } else if (isNightMode) {
        // Keep original building color completely unchanged (warna gedung ga berubah)
        mat.color.copy(origColor);
        if (isWindowMesh) {
          // Add warm glowing yellow window lights on top
          mat.emissive.set('#FFB703');
          mat.emissiveMap = nightWindowTexture;
          mat.emissiveIntensity = 1.5;
        } else {
          mat.emissive.set('#000000');
          mat.emissiveMap = null;
          mat.emissiveIntensity = 0;
        }
      } else {
        // Day mode - original architectural colors
        mat.color.copy(origColor);
        mat.emissive.set('#000000');
        mat.emissiveMap = null;
        mat.emissiveIntensity = 0;
      }
      mat.needsUpdate = true;
    });
  });

  return (
    <primitive
      object={clonedScene}
      position={[offsetX, offsetY, offsetZ]}
      scale={[scaleFactor, scaleFactor, scaleFactor]}
    />
  );
});

// Preload models that actually exist in public/models for instant rendering
useGLTF.preload('/models/bupati.glb');
useGLTF.preload('/models/gedung.glb');
useGLTF.preload('/models/harper.glb');
useGLTF.preload('/models/masjid_agung.glb');
useGLTF.preload('/models/panyawangan.glb');
useGLTF.preload('/models/puskesmas.glb');
useGLTF.preload('/models/rumah_sakit.glb');
useGLTF.preload('/models/sadang.glb');
useGLTF.preload('/models/wikara.glb');

export const InteractiveBuilding: React.FC<InteractiveBuildingProps> = React.memo(({ building, onContextMenu }) => {
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
  const archType = building.architectureType || 'box';

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
    return tex;
  }, []);

  // Generate procedural scattered window LIGHT DOTS (warm yellow & gold) for NIGHT mode
  const nightWindowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 256, 256);

      const cols = 10;
      const rows = 16;
      const cellW = 256 / cols;
      const cellH = 256 / rows;

      // Realistic warm yellow and amber window light colors
      const litYellowColors = ['#FFE066', '#FFB703', '#FEF08A', '#FFD166', '#F59E0B'];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (r >= rows - 2) {
            // Warm entrance lobby glow
            ctx.fillStyle = (c % 2 === 0) ? '#FCD34D' : '#F59E0B';
            ctx.fillRect(c * cellW + 4, r * cellH + 4, cellW - 8, cellH - 8);
          } else {
            // Scattered warm yellow lit window dots (~20% lit windows)
            const seed = (r * 19 + c * 11 + Math.floor(h * 23)) % 100;
            if (seed < 20) {
              const colorIdx = (r * 3 + c * 5 + Math.floor(h)) % litYellowColors.length;
              ctx.fillStyle = litYellowColors[colorIdx];
              ctx.fillRect(c * cellW + 5, r * cellH + 4, cellW - 10, cellH - 8);
            } else {
              // Unlit dark window pane
              ctx.fillStyle = '#000000';
              ctx.fillRect(c * cellW + 5, r * cellH + 4, cellW - 10, cellH - 8);
            }
          }
        }
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, Math.max(1, Math.round(h * 1.5)));
    return tex;
  }, [h]);

  // Helper to generate building material scaled specifically to any sub-mesh height for uniform window distribution
  const createSubMeshMaterial = (subMeshHeight: number) => {
    const repeatY = Math.max(1, Math.round(subMeshHeight * 1.8));

    const dayTex = dayWindowTexture.clone();
    dayTex.repeat.set(1, repeatY);
    dayTex.needsUpdate = true;

    const nightTex = nightWindowTexture.clone();
    nightTex.repeat.set(1, repeatY);
    nightTex.needsUpdate = true;

    return (
      <meshStandardMaterial
        ref={materialRef}
        color={isNightMode ? '#0F172A' : (isSelected ? '#7DD3FC' : building.color || '#D1DBE5')}
        map={isNightMode ? nightTex : dayTex}
        emissiveMap={isNightMode ? nightTex : undefined}
        roughness={0.35}
        metalness={0.15}
        transparent={focusedBuildingId !== null && !isFocused}
        opacity={focusedBuildingId !== null && !isFocused ? 0.35 : 1.0}
      />
    );
  };

  // Animate selection glow and scale
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
        materialRef.current.emissive.set('#FFFFFF');
        materialRef.current.emissiveIntensity = 1.35;
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
      rotation={building.rotation || [0, 0, 0]}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onContextMenu={(e) => {
        if (onContextMenu) {
          const domEvent = (e && (e as any).nativeEvent) ? (e as any).nativeEvent : e;
          onContextMenu(domEvent as unknown as React.MouseEvent, building);
        }
      }}
    >
      {/* Custom 3D Model GLTF / GLB renderer with ErrorBoundary safety */}
      {archType === 'gltf' && building.modelUrl ? (
        <GLTFErrorBoundary
          fallback={
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[w, h, d]} />
              {createSubMeshMaterial(h)}
            </mesh>
          }
        >
          <Suspense
            fallback={
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[w, h, d]} />
                {createSubMeshMaterial(h)}
              </mesh>
            }
          >
            <GLTFModelRenderer
              url={building.modelUrl}
              isNightMode={isNightMode}
              isSelected={isSelected}
              isHovered={isHovered}
              targetDimensions={[w, h, d]}
              nightWindowTexture={nightWindowTexture}
            />
          </Suspense>
        </GLTFErrorBoundary>
      ) : (
        <>
          {/* Procedural Mosque / Grand Dome architecture */}
          {(archType as string) === 'mosque' && (
            <group>
              <mesh castShadow receiveShadow position={[0, -h * 0.15, 0]}>
                <boxGeometry args={[w, h * 0.7, d]} />
                {createSubMeshMaterial(h * 0.7)}
              </mesh>
              {/* Grand Central Dome */}
              <mesh castShadow receiveShadow position={[0, h * 0.35, 0]}>
                <sphereGeometry args={[w * 0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
                <meshStandardMaterial color={isNightMode ? '#38BDF8' : '#0D9488'} roughness={0.2} metalness={0.8} />
              </mesh>
              {/* Minaret */}
              <mesh castShadow receiveShadow position={[w * 0.4, h * 0.2, d * 0.4]}>
                <cylinderGeometry args={[w * 0.06, w * 0.08, h * 1.2, 16]} />
                <meshStandardMaterial color={isNightMode ? '#334155' : '#CBD5E1'} roughness={0.3} />
              </mesh>
            </group>
          )}

          {/* Dynamic Architectural Mesh Renderer */}
          {(archType === 'box' || (archType !== 'stepped' && archType !== 'cylinder' && archType !== 'pyramid' && archType !== 'twin' && archType !== 'l-shaped' && (archType as string) !== 'mosque')) && (
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[w, h, d]} />
              {createSubMeshMaterial(h)}
            </mesh>
          )}

          {archType === 'stepped' && (
            <group>
              <mesh castShadow receiveShadow position={[0, -h * 0.3, 0]}>
                <boxGeometry args={[w, h * 0.4, d]} />
                {createSubMeshMaterial(h * 0.4)}
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0.05 * h, 0]}>
                <boxGeometry args={[w * 0.8, h * 0.35, d * 0.8]} />
                {createSubMeshMaterial(h * 0.35)}
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0.375 * h, 0]}>
                <boxGeometry args={[w * 0.6, h * 0.25, d * 0.6]} />
                {createSubMeshMaterial(h * 0.25)}
              </mesh>
            </group>
          )}

          {archType === 'cylinder' && (
            <group>
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <cylinderGeometry args={[w * 0.48, w * 0.48, h, 32]} />
                {createSubMeshMaterial(h)}
              </mesh>
              {[-0.25 * h, 0, 0.25 * h].map((yOffset, idx) => (
                <mesh key={`ring-${idx}`} position={[0, yOffset, 0]}>
                  <torusGeometry args={[w * 0.49, 0.04, 12, 32]} />
                  <meshStandardMaterial color={isNightMode ? '#38BDF8' : '#64748B'} metalness={0.8} />
                </mesh>
              ))}
            </group>
          )}

          {archType === 'pyramid' && (
            <group>
              <mesh castShadow receiveShadow position={[0, -h * 0.15, 0]}>
                <boxGeometry args={[w, h * 0.7, d]} />
                {createSubMeshMaterial(h * 0.7)}
              </mesh>
              <mesh castShadow receiveShadow position={[0, h * 0.35, 0]} rotation={[0, Math.PI / 4, 0]}>
                <coneGeometry args={[w * 0.75, h * 0.3, 4]} />
                <meshStandardMaterial color={isNightMode ? '#1E293B' : '#475569'} roughness={0.3} metalness={0.6} />
              </mesh>
            </group>
          )}

          {archType === 'twin' && (
            <group>
              <mesh castShadow receiveShadow position={[-w * 0.28, 0, 0]}>
                <boxGeometry args={[w * 0.42, h, d * 0.8]} />
                {createSubMeshMaterial(h)}
              </mesh>
              <mesh castShadow receiveShadow position={[w * 0.28, 0, 0]}>
                <boxGeometry args={[w * 0.42, h, d * 0.8]} />
                {createSubMeshMaterial(h)}
              </mesh>
              <mesh position={[0, h * 0.15, 0]}>
                <boxGeometry args={[w * 0.24, h * 0.1, d * 0.5]} />
                <meshStandardMaterial color="#00D8FF" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>
          )}

          {archType === 'l-shaped' && (
            <group>
              <mesh castShadow receiveShadow position={[0, 0, -d * 0.2]}>
                <boxGeometry args={[w, h, d * 0.6]} />
                {createSubMeshMaterial(h)}
              </mesh>
              <mesh castShadow receiveShadow position={[-w * 0.25, -h * 0.05, d * 0.25]}>
                <boxGeometry args={[w * 0.5, h * 0.9, d * 0.5]} />
                {createSubMeshMaterial(h * 0.9)}
              </mesh>
            </group>
          )}
        </>
      )}

      {/* Rooftop Structures */}
      {archType !== 'gltf' && (
        <group position={[0, halfH, 0]}>
          {/* Parapet border */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[w * 0.9, 0.2, d * 0.9]} />
            <meshStandardMaterial color={isNightMode ? '#1E293B' : '#94A3B8'} roughness={0.4} />
          </mesh>

          {/* Helipad */}
          {building.roofType === 'helipad' && (
            <group position={[0, 0.2, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[Math.min(w, d) * 0.35, 32]} />
                <meshBasicMaterial color="#334155" />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <ringGeometry args={[Math.min(w, d) * 0.28, Math.min(w, d) * 0.33, 32]} />
                <meshBasicMaterial color="#EF4444" />
              </mesh>
            </group>
          )}

          {/* HVAC Chillers */}
          {building.roofType === 'hvac' && (
            <group position={[0, 0.3, 0]}>
              {[-0.5, 0.5].map((xOffset, i) => (
                <mesh key={`hvac-${i}`} position={[xOffset, 0, 0]}>
                  <cylinderGeometry args={[0.25, 0.25, 0.45, 16]} />
                  <meshStandardMaterial color="#64748B" metalness={0.7} />
                </mesh>
              ))}
            </group>
          )}

          {/* Solar Panels */}
          {building.roofType === 'solar' && (
            <group position={[0, 0.25, 0]} rotation={[0.2, 0, 0]}>
              <mesh>
                <boxGeometry args={[w * 0.6, 0.08, d * 0.6]} />
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
      )}

      {/* Building Status Light Beacon */}
      <mesh position={[0, archType === 'gltf' ? 0.35 : (halfH + 0.3), 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
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
        <Html position={[0, archType === 'gltf' ? 1.0 : (halfH + 1.2), 0]} center distanceFactor={22} style={{ pointerEvents: 'none' }}>
          <div className="bg-slate-900/90 text-white font-sans backdrop-blur-md px-3 py-1 rounded-full shadow-xl border border-blue-400/40 text-[11px] font-semibold whitespace-nowrap flex items-center space-x-1.5 animate-in fade-in zoom-in-95 duration-150">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span className="text-blue-300 font-mono">{building.code}</span>
            <span className="text-slate-100">{building.name}</span>
          </div>
        </Html>
      )}
    </group>
  );
});
