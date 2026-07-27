import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Lights } from './Lights';
import { EnvironmentSky } from './EnvironmentSky';
import { CityGrid } from './CityGrid';
import { CampusFence } from './CampusFence';
import { HarperFence } from './HarperFence';
import { PuskesmasFence } from './PuskesmasFence';
import { PrimePlazaFence } from './PrimePlazaFence';
import { PanyawanganFence } from './PanyawanganFence';
import { BupatiFence } from './BupatiFence';
import { BayuAsihFence } from './BayuAsihFence';
import { SadangFence } from './SadangFence';
import { DisnakerFence } from './DisnakerFence';
import { MasjidAgungEntrance } from './MasjidAgungEntrance';
import { CampusParkingLot } from './CampusParkingLot';
import { InteractiveBuilding } from './InteractiveBuilding';
import { InfrastructureLayerOverlay } from './InfrastructureLayerOverlay';
import { MovingVehicles } from './MovingVehicles';
import { CameraController } from './CameraController';
import { Effects } from './Effects';
import { useCityStore } from '../store/useCityStore';
import { BuildingData } from '../types/city';

interface CitySceneProps {
  onContextMenu?: (e: React.MouseEvent, building: BuildingData) => void;
}

export const CityScene: React.FC<CitySceneProps> = ({ onContextMenu }) => {
  const buildings = useCityStore((state) => state.buildings);

  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-[#EEF3F8]">
      <Canvas
        dpr={[1, 1.5]}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        camera={{ position: [16, 18, 22], fov: 40, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
      >
        <EnvironmentSky />
        <Lights />
        <CityGrid />
        <CampusFence />
        <HarperFence />
        <PuskesmasFence />
        <PrimePlazaFence />
        <PanyawanganFence />
        <BupatiFence />
        <BayuAsihFence />
        <SadangFence />
        <DisnakerFence />
        <MasjidAgungEntrance />
        <CampusParkingLot />

        {/* Render interactive city buildings */}
        <group>
          {buildings.map((building) => (
            <InteractiveBuilding
              key={building.id}
              building={building}
              onContextMenu={onContextMenu}
            />
          ))}
        </group>

        <InfrastructureLayerOverlay />
        <MovingVehicles />
        <CameraController />
        <Effects />
      </Canvas>
    </div>
  );
};
