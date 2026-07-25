import React from 'react';

interface TrafficLightsProps {
  nsLightState: 'GREEN' | 'YELLOW' | 'RED';
  ewLightState: 'GREEN' | 'YELLOW' | 'RED';
  isNightMode: boolean;
}

export const TrafficLights: React.FC<TrafficLightsProps> = ({
  nsLightState,
  ewLightState,
  isNightMode,
}) => {
  // 4 Main Intersections: [-6.5, -6.5], [6.5, -6.5], [-6.5, 6.5], [6.5, 6.5]
  const intersections: [number, number][] = [
    [-6.5, -6.5],
    [6.5, -6.5],
    [-6.5, 6.5],
    [6.5, 6.5],
  ];

  // 4 Approach Posts per Intersection
  // Positioned on the right sidewalk of each incoming lane, rotated directly to face oncoming drivers!
  const approaches: {
    offset: [number, number];
    rotation: number;
    axis: 'NS' | 'EW';
    label: string;
  }[] = [
    // North Approach: Driver driving South (+Z). Post on right sidewalk, signal box faces North (-Z).
    { offset: [1.8, -2.4], rotation: Math.PI, axis: 'NS', label: 'North' },

    // South Approach: Driver driving North (-Z). Post on right sidewalk, signal box faces South (+Z).
    { offset: [-1.8, 2.4], rotation: 0, axis: 'NS', label: 'South' },

    // West Approach: Driver driving East (+X). Post on right sidewalk, signal box faces West (-X).
    { offset: [-2.4, 1.8], rotation: -Math.PI / 2, axis: 'EW', label: 'West' },

    // East Approach: Driver driving West (-X). Post on right sidewalk, signal box faces East (+X).
    { offset: [2.4, -1.8], rotation: Math.PI / 2, axis: 'EW', label: 'East' },
  ];

  return (
    <group>
      {intersections.map(([ix, iz], iIdx) => (
        <group key={`int-${iIdx}`} position={[ix, 0, iz]}>
          {approaches.map((app, aIdx) => {
            const state = app.axis === 'NS' ? nsLightState : ewLightState;

            const isRed = state === 'RED';
            const isYellow = state === 'YELLOW';
            const isGreen = state === 'GREEN';

            return (
              <group
                key={`post-${aIdx}`}
                position={[app.offset[0], 0, app.offset[1]]}
                rotation={[0, app.rotation, 0]}
              >
                {/* Metallic Pole Post */}
                <mesh position={[0, 1.3, 0]} castShadow>
                  <cylinderGeometry args={[0.06, 0.08, 2.6, 12]} />
                  <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
                </mesh>

                {/* Overhang Arm extending towards the lane */}
                <mesh position={[0, 2.5, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.04, 0.04, 0.45, 8]} />
                  <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
                </mesh>

                {/* Traffic Light Signal Box */}
                <mesh position={[0, 2.45, 0.48]}>
                  <boxGeometry args={[0.24, 0.78, 0.18]} />
                  <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
                </mesh>

                {/* Red Signal Bulb (Top) */}
                <mesh position={[0, 2.68, 0.58]}>
                  <sphereGeometry args={[0.075, 16, 16]} />
                  <meshBasicMaterial color={isRed ? '#FF1744' : '#450A0A'} />
                </mesh>
                {isRed && (
                  <pointLight
                    position={[0, 2.68, 0.65]}
                    color="#FF1744"
                    intensity={isNightMode ? 1.5 : 0.8}
                    distance={3.0}
                  />
                )}

                {/* Yellow Signal Bulb (Middle) */}
                <mesh position={[0, 2.45, 0.58]}>
                  <sphereGeometry args={[0.075, 16, 16]} />
                  <meshBasicMaterial color={isYellow ? '#FFEA00' : '#422006'} />
                </mesh>
                {isYellow && (
                  <pointLight
                    position={[0, 2.45, 0.65]}
                    color="#FFEA00"
                    intensity={isNightMode ? 1.5 : 0.8}
                    distance={3.0}
                  />
                )}

                {/* Green Signal Bulb (Bottom) */}
                <mesh position={[0, 2.22, 0.58]}>
                  <sphereGeometry args={[0.075, 16, 16]} />
                  <meshBasicMaterial color={isGreen ? '#00E676' : '#022C22'} />
                </mesh>
                {isGreen && (
                  <pointLight
                    position={[0, 2.22, 0.65]}
                    color="#00E676"
                    intensity={isNightMode ? 1.5 : 0.8}
                    distance={3.0}
                  />
                )}
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
};
