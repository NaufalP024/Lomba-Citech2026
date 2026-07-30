import React, { useMemo } from 'react';
import * as THREE from 'three';

// Generate a procedural high-resolution soft radial gradient texture for street light halos
function createRadialLightTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(255, 247, 215, 1.0)');     // Pure warm white core
  gradient.addColorStop(0.2, 'rgba(254, 240, 138, 0.75)');   // Vibrant warm yellow halo
  gradient.addColorStop(0.5, 'rgba(250, 204, 21, 0.25)');    // Soft golden falloff
  gradient.addColorStop(0.8, 'rgba(234, 179, 8, 0.08)');    // Ambient outer ring
  gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0)');            // Completely transparent smooth edge

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface StreetLightProps {
  position: [number, number, number];
  rotationY?: number;
  lightTexture: THREE.CanvasTexture;
}

const SingleStreetLight: React.FC<StreetLightProps> = ({ position, rotationY = 0, lightTexture }) => {

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Sleek Modern Pole */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 2.4, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Curved Arm Over Road */}
      <mesh position={[0.25, 2.35, 0]} rotation={[0, 0, -Math.PI / 10]}>
        <cylinderGeometry args={[0.03, 0.04, 0.65, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Fixture Lamp Head */}
      <mesh position={[0.52, 2.4, 0]}>
        <boxGeometry args={[0.32, 0.07, 0.14]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Emissive Lamp Lens Lens Bulb */}
      <mesh position={[0.52, 2.36, 0]}>
        <boxGeometry args={[0.26, 0.02, 0.1]} />
        <meshStandardMaterial
          color={'#94A3B8'}
          emissive={'#000000'}
          emissiveIntensity={0}
        />
      </mesh>

    </group>
  );
};

export const StreetLights: React.FC = () => {
  // Memoize procedural light halo texture
  const lightTexture = useMemo(() => createRadialLightTexture(), []);

  // Generate streetlight locations along grid roads
  const lightPositions = useMemo(() => {
    const list: { pos: [number, number, number]; rot: number }[] = [];

    // Along X = -8.0 facing right towards X = -6.5 road
    const zCoords = [-20, -13, -6.5, 0, 6.5, 13, 20];
    zCoords.forEach((z) => {
      list.push({ pos: [-8.0, 0, z], rot: 0 });
      list.push({ pos: [-5.0, 0, z], rot: Math.PI });
    });

    // Along X = 8.0 facing left towards X = 6.5 road
    zCoords.forEach((z) => {
      list.push({ pos: [5.0, 0, z], rot: 0 });
      list.push({ pos: [8.0, 0, z], rot: Math.PI });
    });

    // Along Z = -8.0 facing forward towards Z = -6.5 road
    const xCoords = [-18, -10, 0, 10, 18];
    xCoords.forEach((x) => {
      list.push({ pos: [x, 0, -8.0], rot: Math.PI / 2 });
      list.push({ pos: [x, 0, -5.0], rot: -Math.PI / 2 });
      list.push({ pos: [x, 0, 5.0], rot: Math.PI / 2 });
      list.push({ pos: [x, 0, 8.0], rot: -Math.PI / 2 });
    });

    return list;
  }, []);

  return (
    <group>
      {lightPositions.map((item, idx) => (
        <SingleStreetLight
          key={`street-light-${idx}`}
          position={item.pos}
          rotationY={item.rot}
          lightTexture={lightTexture}
        />
      ))}
    </group>
  );
};
