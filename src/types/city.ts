export type BuildingStatus = 'Normal' | 'Warning' | 'Critical' | 'Maintenance';

export type InfraLayer = 'electricity' | 'water' | 'hvac' | 'occupancy' | 'fire' | 'solar' | 'internet' | 'eco_green';

export type NavTab = 'Dashboard' | 'Grid' | 'Analytics' | 'Incidents' | 'Users';

export type ArchitectureType = 'box' | 'stepped' | 'cylinder' | 'pyramid' | 'twin' | 'l-shaped' | 'gltf';

export interface LoadDistribution {
  lighting: number;
  hvac: number;
  misc: number;
  itServers: number;
}

export interface BuildingData {
  id: string;
  code: string;
  name: string;
  type: string;
  status: BuildingStatus;
  statusLabel: string;
  occupancy: number; // percentage
  totalArea: string;
  tenants: string;
  operationalSince: number;
  currentConsumption: number; // kW
  peakConsumption: number; // kW
  averageLoad: number; // kW
  loadTrend: 'Rising' | 'Stable' | 'Falling';
  exteriorLight: string;
  waterPressure: number; // Bar
  waterUsage: number; // L/m
  hvacEfficiency: number; // %
  hvacTemp: number; // °C
  waterSupplyHealth: number; // %
  fireSafetyHealth: number; // %
  alertsCount: number;
  alertMessage: string;
  position: [number, number, number];
  rotation?: [number, number, number]; // [rotX, rotY, rotZ] rotation angles
  dimensions: [number, number, number]; // [width, height, depth]
  color?: string;
  roofType: 'helipad' | 'hvac' | 'solar' | 'spire' | 'terrace';
  architectureType?: ArchitectureType;
  modelUrl?: string; // Path to custom 3D GLTF/GLB model
  loadDistribution: LoadDistribution;
  powerHistory: number[];
  // Eco-Green & Carbon Index
  carbonEmission?: number; // kg CO2/day
  ecoStatus?: 'Green' | 'Warning' | 'High Emission';
  solarEnergyShare?: number; // %
  aiEcoRecommendation?: string;
  coordinator?: string;
}

export interface IncidentItem {
  id: string;
  buildingId: string;
  buildingName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  time: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  reporter?: string;
}

export interface SmartNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
}

export interface UserItem {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'Offline';
  avatarUrl: string;
}
