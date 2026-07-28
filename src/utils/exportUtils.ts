import confetti from 'canvas-confetti';
import { BuildingData } from '../types/city';

export function exportCityDataJSON(buildings: BuildingData[]) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(buildings, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `CityOS_DigitalTwin_Report_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  // Trigger celebration confetti
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#3B82F6', '#60A5FA', '#00D8FF', '#34D399']
  });
}

export function exportCityDataCSV(buildings: BuildingData[]) {
  const headers = ['ID', 'Kode Aset', 'Nama Gedung', 'Kategori', 'Status', 'Okupansi (%)', 'Luas Area', 'Konsumsi Daya (kW)', 'Beban Puncak (kW)', 'Tekanan Air (Bar)', 'Efisiensi HVAC (%)'];
  const rows = buildings.map(b => [
    b.id,
    `"${b.code}"`,
    `"${b.name}"`,
    `"${b.type}"`,
    `"${b.statusLabel}"`,
    b.occupancy,
    `"${b.totalArea}"`,
    b.currentConsumption,
    b.peakConsumption,
    b.waterPressure,
    b.hvacEfficiency
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", csvContent);
  downloadAnchor.setAttribute("download", `CityOS_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#3B82F6', '#60A5FA', '#00D8FF', '#34D399']
  });
}
