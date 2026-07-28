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
    let msg = 'Batas ambang kritis sistem terlampaui.';
    if (waterPressure < 2.0) {
      msg = `Anomali Tekanan Air: Tekanan turun drastis ke ${waterPressure.toFixed(1)} Bar.`;
    } else if (waterPressure > 6.0) {
      msg = `Anomali Tekanan Air: Tekanan melonjak ke ${waterPressure.toFixed(1)} Bar.`;
    } else if (powerLoadPercent >= 95) {
      msg = `Kelebihan Beban Listrik Kritis: Konsumsi daya mencapai ${powerLoadPercent.toFixed(0)}% dari kapasitas puncak.`;
    } else if (fireSafetyHealth < 50) {
      msg = `Bahaya Keselamatan Kebakaran: Kesehatan sistem kritis pada ${fireSafetyHealth}%.`;
    } else if (waterSupplyHealth < 50) {
      msg = `Krisis Pasokan Air: Kesehatan sub-grid gagal pada ${waterSupplyHealth}%.`;
    }
    return {
      status: 'Critical',
      statusLabel: 'Peringatan Kritis',
      alertMessage: msg,
    };
  }

  // 2. MAINTENANCE REQUIRED CONDITIONS (Blue 🔵)
  if (manualStatus === 'Maintenance' || (data.hvacEfficiency !== undefined && data.hvacEfficiency < 65)) {
    return {
      status: 'Maintenance',
      statusLabel: 'Perlu Pemeliharaan',
      alertMessage: 'Kalibrasi sistem terjadwal & pemeliharaan rutin sedang berlangsung.',
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
    let msg = 'Permintaan operasional tinggi tercatat dalam siklus ini.';
    if (powerLoadPercent >= 80) {
      msg = `Beban Listrik Tinggi: Beroperasi pada ${powerLoadPercent.toFixed(0)}% dari kapasitas puncak.`;
    } else if (waterPressure < 3.2 || waterPressure > 5.5) {
      msg = `Peringatan Tekanan Air: Tekanan aliran berfluktuasi pada ${waterPressure.toFixed(1)} Bar.`;
    } else if (occupancy >= 90) {
      msg = `Kepadatan Tinggi: Kepadatan pengunjung bangunan mencapai ${occupancy}%.`;
    }
    return {
      status: 'Warning',
      statusLabel: 'Peringatan Beban Tinggi',
      alertMessage: msg,
    };
  }

  // 4. SYSTEM NOMINAL (Green 🟢)
  return {
    status: 'Normal',
    statusLabel: 'Sistem Normal',
    alertMessage: 'Seluruh fasilitas gedung beroperasi dalam parameter optimal.',
  };
}
