import { BuildingData, BuildingStatus } from '../types/city';

export interface AutomatedStatusResult {
  status: BuildingStatus;
  statusLabel: string;
  alertMessage: string;
}

/**
 * Automated System Rules Engine for CityOS Digital Twin
 * Evaluates building telemetry metrics (Power load %, Water Pressure Bar, Fire Safety %, Occupancy %)
 * and automatically derives the standard building status, status label, and alert message.
 */
export function calculateBuildingStatus(data: Partial<BuildingData>): AutomatedStatusResult {
  const currentConsumption = data.currentConsumption ?? 400;
  const peakConsumption = data.peakConsumption ?? 600;
  const waterPressure = data.waterPressure ?? 4.5;
  const fireSafetyHealth = data.fireSafetyHealth ?? 90;
  const waterSupplyHealth = data.waterSupplyHealth ?? 90;
  const occupancy = data.occupancy ?? 75;
  const manualStatus = data.status;

  const powerLoadPercent = (currentConsumption / Math.max(1, peakConsumption)) * 100;

  // 1. CRITICAL ALERT CONDITIONS (Red 🔴)
  if (
    manualStatus === 'Critical' ||
    waterPressure < 2.0 ||
    waterPressure > 6.0 ||
    powerLoadPercent >= 95 ||
    fireSafetyHealth < 50 ||
    waterSupplyHealth < 50
  ) {
    let msg = 'System critical threshold exceeded.';
    if (waterPressure < 2.0) {
      msg = `Water Pressure Anomaly: Pressure dropped dangerously to ${waterPressure.toFixed(1)} Bar.`;
    } else if (waterPressure > 6.0) {
      msg = `Water Pressure Anomaly: Pressure spiked excessively to ${waterPressure.toFixed(1)} Bar.`;
    } else if (powerLoadPercent >= 95) {
      msg = `Critical Power Overload: Power draw reached ${powerLoadPercent.toFixed(0)}% of peak capacity.`;
    } else if (fireSafetyHealth < 50) {
      msg = `Fire Safety Hazard: System health critical at ${fireSafetyHealth}%.`;
    } else if (waterSupplyHealth < 50) {
      msg = `Water Supply Crisis: Sub-grid supply health failed at ${waterSupplyHealth}%.`;
    }
    return {
      status: 'Critical',
      statusLabel: 'Critical Alert',
      alertMessage: msg,
    };
  }

  // 2. MAINTENANCE REQUIRED CONDITIONS (Blue 🔵)
  if (manualStatus === 'Maintenance' || (data.hvacEfficiency !== undefined && data.hvacEfficiency < 65)) {
    return {
      status: 'Maintenance',
      statusLabel: 'Maintenance Required',
      alertMessage: 'Scheduled system calibration & routine maintenance in progress.',
    };
  }

  // 3. HIGH LOAD WARNING CONDITIONS (Yellow 🟡)
  if (
    manualStatus === 'Warning' ||
    powerLoadPercent >= 80 ||
    occupancy >= 90 ||
    waterPressure < 3.2 ||
    waterPressure > 5.5
  ) {
    let msg = 'High operational demand logged in current cycle.';
    if (powerLoadPercent >= 80) {
      msg = `High Power Demand: Operating at ${powerLoadPercent.toFixed(0)}% of peak capacity.`;
    } else if (waterPressure < 3.2 || waterPressure > 5.5) {
      msg = `Water Pressure Warning: Flow pressure fluctuating at ${waterPressure.toFixed(1)} Bar.`;
    } else if (occupancy >= 90) {
      msg = `High Occupancy Load: Building visitor density reached ${occupancy}%.`;
    }
    return {
      status: 'Warning',
      statusLabel: 'High Load Warning',
      alertMessage: msg,
    };
  }

  // 4. SYSTEM NOMINAL (Green 🟢)
  return {
    status: 'Normal',
    statusLabel: 'System Nominal',
    alertMessage: 'All building utilities operating within optimal parameters.',
  };
}
