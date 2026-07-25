import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../store/useCityStore';
import { TrafficLights } from './TrafficLights';

interface VehicleData {
  id: number;
  axis: 'X' | 'Z';
  fixedCoord: number;
  direction: 1 | -1; // 1 for +X/+Z, -1 for -X/-Z
  baseSpeed: number;
  color: string;
}

export const MovingVehicles: React.FC = () => {
  const isNightMode = useCityStore((state) => state.isNightMode);
  const vehiclesRef = useRef<THREE.Group>(null);

  // Traffic Light Cycle State ('GREEN' | 'YELLOW' | 'RED')
  const [nsLightState, setNsLightState] = useState<'GREEN' | 'YELLOW' | 'RED'>('GREEN');
  const [ewLightState, setEwLightState] = useState<'GREEN' | 'YELLOW' | 'RED'>('RED');

  // Spawn Vehicles on 4 Main Corridors
  const vehicles: VehicleData[] = useMemo(() => {
    const arr: VehicleData[] = [];
    const colors = [
      '#3B82F6', '#00D8FF', '#F59E0B', '#34D399', '#60A5FA',
      '#FBBF24', '#38BDF8', '#EC4899', '#A855F7', '#EF4444'
    ];

    let idCounter = 0;

    // East-West Roads (Z = -6.5 and Z = 6.5)
    [-6.5, 6.5].forEach((zRoad) => {
      // Eastbound (+X, right lane)
      for (let i = 0; i < 4; i++) {
        arr.push({
          id: idCounter++,
          axis: 'X',
          fixedCoord: zRoad + 0.85,
          direction: 1,
          baseSpeed: 7.0 + (i % 2) * 1.5,
          color: colors[idCounter % colors.length],
        });
      }
      // Westbound (-X, left lane)
      for (let i = 0; i < 4; i++) {
        arr.push({
          id: idCounter++,
          axis: 'X',
          fixedCoord: zRoad - 0.85,
          direction: -1,
          baseSpeed: 7.0 + (i % 2) * 1.5,
          color: colors[idCounter % colors.length],
        });
      }
    });

    // North-South Roads (X = -6.5 and X = 6.5)
    [-6.5, 6.5].forEach((xRoad) => {
      // Southbound (+Z, right lane)
      for (let i = 0; i < 4; i++) {
        arr.push({
          id: idCounter++,
          axis: 'Z',
          fixedCoord: xRoad + 0.85,
          direction: 1,
          baseSpeed: 7.0 + (i % 2) * 1.5,
          color: colors[idCounter % colors.length],
        });
      }
      // Northbound (-Z, left lane)
      for (let i = 0; i < 4; i++) {
        arr.push({
          id: idCounter++,
          axis: 'Z',
          fixedCoord: xRoad - 0.85,
          direction: -1,
          baseSpeed: 7.0 + (i % 2) * 1.5,
          color: colors[idCounter % colors.length],
        });
      }
    });

    return arr;
  }, []);

  // Store current live positions & actual current speeds
  const stateRef = useRef<{ [key: number]: { pos: number; speed: number } }>({});

  // Initialize initial positions spread out nicely
  useMemo(() => {
    vehicles.forEach((v) => {
      const initialOffset = (v.id % 4) * 16 - 28 + (v.id % 2) * 3;
      stateRef.current[v.id] = {
        pos: initialOffset,
        speed: v.baseSpeed,
      };
    });
  }, [vehicles]);

  const meshRefs = useRef<{ [key: number]: THREE.Group | null }>({});

  // Main Traffic Light Simulation Loop
  useFrame((state, delta) => {
    const clock = state.clock.getElapsedTime();
    const cycle = clock % 14.0; // 14-second traffic signal loop

    // Determine current light states
    let newNsState: 'GREEN' | 'YELLOW' | 'RED' = 'RED';
    let newEwState: 'GREEN' | 'YELLOW' | 'RED' = 'RED';

    if (cycle < 5.0) {
      newNsState = 'GREEN';
      newEwState = 'RED';
    } else if (cycle < 7.0) {
      newNsState = 'YELLOW';
      newEwState = 'RED';
    } else if (cycle < 12.0) {
      newNsState = 'RED';
      newEwState = 'GREEN';
    } else {
      newNsState = 'RED';
      newEwState = 'YELLOW';
    }

    if (nsLightState !== newNsState) setNsLightState(newNsState);
    if (ewLightState !== newEwState) setEwLightState(newEwState);

    // Group vehicles by lane key (axis + fixedCoord) to calculate car-following distance & queues
    const laneMap: { [key: string]: { vehicle: VehicleData; pos: number }[] } = {};

    vehicles.forEach((v) => {
      const key = `${v.axis}_${v.fixedCoord.toFixed(2)}`;
      if (!laneMap[key]) laneMap[key] = [];
      const currentPos = stateRef.current[v.id]?.pos ?? 0;
      laneMap[key].push({ vehicle: v, pos: currentPos });
    });

    // Update each lane's vehicles in order of direction
    Object.values(laneMap).forEach((laneVehicles) => {
      if (laneVehicles.length === 0) return;
      const dir = laneVehicles[0].vehicle.direction;

      // Sort vehicles in order of travel: leading car first
      laneVehicles.sort((a, b) => (dir > 0 ? b.pos - a.pos : a.pos - b.pos));

      for (let i = 0; i < laneVehicles.length; i++) {
        const item = laneVehicles[i];
        const v = item.vehicle;
        const s = stateRef.current[v.id];
        if (!s) continue;

        const currentPos = s.pos;
        const lightState = v.axis === 'X' ? newEwState : newNsState;

        // Find upcoming stop lines for this lane
        // Intersections are at -6.5 and 6.5. Stop line is 2.8 units before intersection.
        let targetSpeed = v.baseSpeed;

        // Check nearest upcoming stop line ahead
        const stopLines = dir > 0 ? [-9.3, 3.7] : [9.3, -3.7];

        for (const stopLine of stopLines) {
          const distToStopLine = dir > 0 ? stopLine - currentPos : currentPos - stopLine;

          // If approaching stop line (within 7.5 units before line and not yet past it)
          if (distToStopLine > -0.5 && distToStopLine < 7.5) {
            if (lightState === 'RED') {
              if (distToStopLine > 0) {
                // Decelerate to 0 at the stop line
                const stopFactor = Math.max(0, distToStopLine / 7.5);
                targetSpeed = Math.min(targetSpeed, v.baseSpeed * Math.pow(stopFactor, 1.2));
                if (distToStopLine < 0.3) targetSpeed = 0;
              }
            } else if (lightState === 'YELLOW') {
              // Slow down significantly (35% speed)
              targetSpeed = Math.min(targetSpeed, v.baseSpeed * 0.35);
            }
          }
        }

        // Car-Following Safety Distance (Queuing behind stopped/slower cars)
        if (i > 0) {
          const carAhead = laneVehicles[i - 1];
          const distToAhead = dir > 0 ? carAhead.pos - currentPos : currentPos - carAhead.pos;
          const minSafeGap = 2.4; // minimum safe bumper distance

          if (distToAhead < minSafeGap + 5.0 && distToAhead > 0) {
            const aheadSpeed = stateRef.current[carAhead.vehicle.id]?.speed ?? 0;
            const gapFactor = Math.max(0, (distToAhead - minSafeGap) / 5.0);
            const maxAllowedSpeed = aheadSpeed + (v.baseSpeed - aheadSpeed) * gapFactor;
            targetSpeed = Math.min(targetSpeed, maxAllowedSpeed);

            if (distToAhead <= minSafeGap) {
              targetSpeed = 0;
            }
          }
        }

        // Smooth speed interpolation (Acceleration / Braking physics)
        const lerpRate = targetSpeed < s.speed ? 4.5 : 2.5; // Brake faster than acceleration
        s.speed += (targetSpeed - s.speed) * Math.min(1.0, delta * lerpRate);

        // Advance vehicle position
        s.pos += dir * s.speed * delta;

        // Wrap around loop bounds (-35 to +35)
        if (dir > 0 && s.pos > 35) s.pos = -35;
        if (dir < 0 && s.pos < -35) s.pos = 35;

        // Update 3D mesh position
        const g = meshRefs.current[v.id];
        if (g) {
          if (v.axis === 'X') {
            g.position.x = s.pos;
          } else {
            g.position.z = s.pos;
          }
        }
      }
    });
  });

  return (
    <group ref={vehiclesRef}>
      {/* 3D Traffic Light Posts at Intersections */}
      <TrafficLights
        nsLightState={nsLightState}
        ewLightState={ewLightState}
        isNightMode={isNightMode}
      />

      {/* Moving & Stopping 3D Vehicles */}
      {vehicles.map((v) => (
        <group
          key={v.id}
          ref={(el) => (meshRefs.current[v.id] = el)}
          position={
            v.axis === 'X'
              ? [stateRef.current[v.id]?.pos ?? 0, 0.12, v.fixedCoord]
              : [v.fixedCoord, 0.12, stateRef.current[v.id]?.pos ?? 0]
          }
          rotation={[
            0,
            v.axis === 'X'
              ? v.direction > 0
                ? 0
                : Math.PI
              : v.direction > 0
              ? -Math.PI / 2
              : Math.PI / 2,
            0,
          ]}
        >
          {/* Car Body */}
          <mesh castShadow position={[0, 0.12, 0]}>
            <boxGeometry args={[0.75, 0.22, 0.35]} />
            <meshStandardMaterial color={v.color} roughness={0.3} metalness={0.5} />
          </mesh>

          {/* Car Cabin */}
          <mesh position={[-0.05, 0.26, 0]}>
            <boxGeometry args={[0.42, 0.16, 0.3]} />
            <meshStandardMaterial color="#1E293B" roughness={0.1} />
          </mesh>

          {/* Headlights */}
          <mesh position={[0.38, 0.12, 0.12]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={isNightMode ? '#38BDF8' : '#FEF08A'} />
          </mesh>
          <mesh position={[0.38, 0.12, -0.12]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={isNightMode ? '#38BDF8' : '#FEF08A'} />
          </mesh>

          {/* Red Brake Taillights (Glow brightly when vehicle is stopping / queued) */}
          <mesh position={[-0.38, 0.12, 0.12]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
          <mesh position={[-0.38, 0.12, -0.12]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
        </group>
      ))}
    </group>
  );
};
