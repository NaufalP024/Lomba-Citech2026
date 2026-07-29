import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useCityStore } from '../store/useCityStore';

export const CameraController: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const selectedBuildingId = useCityStore((state) => state.selectedBuildingId);
  const focusedBuildingId = useCityStore((state) => state.focusedBuildingId);
  const resetCameraTrigger = useCityStore((state) => state.resetCameraTrigger);
  const buildings = useCityStore((state) => state.buildings);
  const updateDeveloperStats = useCityStore((state) => state.updateDeveloperStats);
  const isAuthenticated = useCityStore((state) => state.isAuthenticated);

  // Target camera position and controls target
  const targetCamPos = useRef(new THREE.Vector3(16, 18, 22));
  const targetLookAt = useRef(new THREE.Vector3(0, 2, 0));

  // Default camera angle matching reference image
  useEffect(() => {
    camera.position.set(16, 18, 22);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 2, 0);
      controlsRef.current.update();
    }
  }, [camera]);

  // Handle building selection camera transition
  useEffect(() => {
    const targetBuilding = buildings.find(
      (b) => b.id === (focusedBuildingId || selectedBuildingId)
    );

    if (targetBuilding) {
      const [bx, by, bz] = targetBuilding.position;
      const bh = targetBuilding.dimensions[1];

      targetLookAt.current.set(bx, bh / 2, bz);

      if (focusedBuildingId) {
        // Focus Mode zoom closer
        targetCamPos.current.set(bx + 7, bh + 5, bz + 9);
      } else {
        // Normal building selection camera view
        targetCamPos.current.set(bx + 12, bh + 12, bz + 15);
      }
    } else {
      // Reset view
      targetCamPos.current.set(16, 18, 22);
      targetLookAt.current.set(0, 2, 0);
    }
  }, [selectedBuildingId, focusedBuildingId, buildings]);

  // Reset camera when triggered by keyboard or button
  useEffect(() => {
    if (resetCameraTrigger > 0) {
      targetCamPos.current.set(16, 18, 22);
      targetLookAt.current.set(0, 2, 0);
    }
  }, [resetCameraTrigger]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // Smoothly lerp camera position and lookAt target
    camera.position.lerp(targetCamPos.current, delta * 3.5);
    controlsRef.current.target.lerp(targetLookAt.current, delta * 3.5);
    controlsRef.current.update();

    // Update dev stats
    updateDeveloperStats({
      cameraPos: [
        Math.round(camera.position.x * 10) / 10,
        Math.round(camera.position.y * 10) / 10,
        Math.round(camera.position.z * 10) / 10,
      ],
    });
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      autoRotate={!isAuthenticated}
      autoRotateSpeed={0.8}
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera going below ground
      minDistance={6}
      maxDistance={70}
    />
  );
};
