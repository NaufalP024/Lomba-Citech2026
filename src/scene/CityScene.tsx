import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Lights } from './Lights';
import { EnvironmentSky } from './EnvironmentSky';
import { CityGrid } from './CityGrid';
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
        shadows
        camera={{ position: [16, 18, 22], fov: 40, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      >
        <EnvironmentSky />
        <Lights />
        <CityGrid />
        
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
