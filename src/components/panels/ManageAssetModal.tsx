import React, { useState, useEffect } from 'react';
import { useCityStore } from '../../store/useCityStore';
import analyticsData from '../../data/analytics.json';
import { Settings, X, Save, Building2, Zap, Shield, Droplet, Users, Activity, Lock, Leaf, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { calculateBuildingStatus } from '../../utils/buildingStatusEngine';

export const ManageAssetModal: React.FC = () => {
  const isManageAssetOpen = useCityStore((state) => state.isManageAssetOpen);
  const setManageAssetOpen = useCityStore((state) => state.setManageAssetOpen);
  const selectedBuildingId = useCityStore((state) => state.selectedBuildingId);
  const buildings = useCityStore((state) => state.buildings);
  const updateBuildingData = useCityStore((state) => state.updateBuildingData);
  const currentUser = useCityStore((state) => state.currentUser);

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId) || buildings[0];

  const canEditBuilding =
    currentUser?.isSuperAdmin ||
    currentUser?.assignedBuildingId === selectedBuilding.id ||
    currentUser?.assignedBuildingId === 'all';

  const [name, setName] = useState(selectedBuilding.name);
  const [type, setType] = useState(selectedBuilding.type);
  const [status, setStatus] = useState(selectedBuilding.status);
  const [currentConsumption, setCurrentConsumption] = useState(selectedBuilding.currentConsumption);
  const [peakConsumption, setPeakConsumption] = useState(selectedBuilding.peakConsumption);
  const [waterPressure, setWaterPressure] = useState(selectedBuilding.waterPressure);
  const [occupancy, setOccupancy] = useState(selectedBuilding.occupancy);
  const [exteriorLight, setExteriorLight] = useState(selectedBuilding.exteriorLight);

  const [carbonEmission, setCarbonEmission] = useState(selectedBuilding.carbonEmission ?? Math.round(selectedBuilding.currentConsumption * 0.45));
  const [solarEnergyShare, setSolarEnergyShare] = useState(selectedBuilding.solarEnergyShare ?? 35);

  const getAssignedCoordinator = (buildingId: string) => {
    const user = analyticsData.users.find((u: { assignedBuildingId: string }) => u.assignedBuildingId === buildingId);
    return user ? `${user.name} (${user.role})` : 'Pak Budi Santoso (Kepala Dinas Kominfo)';
  };

  const [coordinator, setCoordinator] = useState(
    selectedBuilding.coordinator || getAssignedCoordinator(selectedBuilding.id)
  );

  useEffect(() => {
    setName(selectedBuilding.name);
    setType(selectedBuilding.type);
    setStatus(selectedBuilding.status);
    setCurrentConsumption(selectedBuilding.currentConsumption);
    setPeakConsumption(selectedBuilding.peakConsumption);
    setWaterPressure(selectedBuilding.waterPressure);
    setOccupancy(selectedBuilding.occupancy);
    setExteriorLight(selectedBuilding.exteriorLight);
    setCarbonEmission(selectedBuilding.carbonEmission ?? Math.round(selectedBuilding.currentConsumption * 0.45));
    setSolarEnergyShare(selectedBuilding.solarEnergyShare ?? 35);
    setCoordinator(selectedBuilding.coordinator || getAssignedCoordinator(selectedBuilding.id));
  }, [selectedBuilding]);

  if (!isManageAssetOpen) return null;

  // Real-time preview of auto-calculated status
  const preview = calculateBuildingStatus({
    status,
    currentConsumption: Number(currentConsumption),
    peakConsumption: Number(peakConsumption),
    waterPressure: Number(waterPressure),
    occupancy: Number(occupancy),
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newCarbon = Number(carbonEmission);
    const calculatedEcoStatus = newCarbon < 220 ? 'Green' : newCarbon < 400 ? 'Warning' : 'High Emission';

    updateBuildingData(selectedBuilding.id, {
      name,
      type,
      status,
      currentConsumption: Number(currentConsumption),
      peakConsumption: Number(peakConsumption),
      waterPressure: Number(waterPressure),
      occupancy: Number(occupancy),
      exteriorLight,
      coordinator,
      carbonEmission: newCarbon,
      solarEnergyShare: Number(solarEnergyShare),
      ecoStatus: calculatedEcoStatus,
    });

    toast.success(`Data "${name}" berhasil diperbarui oleh ${coordinator}!`, {
      description: `Emisi Karbon: ${newCarbon} kg CO₂/hari (${calculatedEcoStatus}) | Status: ${preview.statusLabel}`,
    });

    setManageAssetOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg my-auto max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-500 text-white">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Kelola Detail Aset
              </h2>
              <p className="text-xs text-slate-400">
                {selectedBuilding.code} • {selectedBuilding.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setManageAssetOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Auto-Calculated Status Preview Badge */}
        <div className="mx-6 mt-4 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Status Hasil Analisis Sistem:
            </span>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              preview.status === 'Critical'
                ? 'bg-red-500/15 text-red-500 border border-red-500/30'
                : preview.status === 'Warning'
                ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                : preview.status === 'Maintenance'
                ? 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
                : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
            }`}
          >
            {preview.statusLabel}
          </span>
        </div>

        {/* Permission Restriction Lock Notice */}
        {!canEditBuilding && (
          <div className="mx-6 mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center space-x-2 text-xs">
            <Lock className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-bold text-amber-600 dark:text-amber-400">
              Akses Terbatas: Hanya Buka (Read-Only)
            </span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 pt-3 space-y-3.5 text-xs overflow-y-auto max-h-[calc(88vh-80px)]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Gedung
              </label>
              <input
                type="text"
                disabled={!canEditBuilding}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Koordinator Penanggung Jawab
              </label>
              <input
                type="text"
                disabled={!canEditBuilding}
                value={coordinator}
                onChange={(e) => setCoordinator(e.target.value)}
                placeholder="Nama & Jabatan Koordinator"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Gedung
              </label>
              <input
                type="text"
                disabled={!canEditBuilding}
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status Manual
              </label>
              <select
                disabled={!canEditBuilding}
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="Normal">Normal (Operasional Optimal)</option>
                <option value="Warning">Peringatan (Beban Tinggi)</option>
                <option value="Critical">Kritis (Darurat)</option>
                <option value="Maintenance">Pemeliharaan (Perlu Perbaikan)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Konsumsi Daya (kW)</span>
                <Zap className="w-3 h-3 text-amber-500" />
              </label>
              <input
                type="number"
                disabled={!canEditBuilding}
                value={currentConsumption}
                onChange={(e) => setCurrentConsumption(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Tekanan Air (Bar)</span>
                <Droplet className="w-3 h-3 text-cyan-500" />
              </label>
              <input
                type="number"
                step="0.1"
                disabled={!canEditBuilding}
                value={waterPressure}
                onChange={(e) => setWaterPressure(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Tingkat Okupansi (%)</span>
                <Users className="w-3 h-3 text-purple-500" />
              </label>
              <input
                type="number"
                min="0"
                max="100"
                disabled={!canEditBuilding}
                value={occupancy}
                onChange={(e) => setOccupancy(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pencahayaan Luar Gedung
              </label>
              <select
                disabled={!canEditBuilding}
                value={exteriorLight}
                onChange={(e) => setExteriorLight(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="ON (100%)">ON (100%)</option>
                <option value="ON (75%)">ON (75%)</option>
                <option value="ON (50%)">ON (50%)</option>
                <option value="OFF">OFF</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Emisi Karbon (kg CO₂/hari)</span>
                <Leaf className="w-3.5 h-3.5 text-emerald-500" />
              </label>
              <input
                type="number"
                min="0"
                disabled={!canEditBuilding}
                value={carbonEmission}
                onChange={(e) => setCarbonEmission(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Porsi Energi Surya (%)</span>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              </label>
              <input
                type="number"
                min="0"
                max="100"
                disabled={!canEditBuilding}
                value={solarEnergyShare}
                onChange={(e) => setSolarEnergyShare(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono"
              />
            </div>
          </div>

          {/* Alert Message Preview */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-[11px]">
            <span className="text-slate-400 font-medium">Pesan Peringatan Terdeteksi: </span>
            <span className="text-slate-700 dark:text-slate-200 font-mono">{preview.alertMessage}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setManageAssetOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            >
              Tutup
            </button>
            {canEditBuilding && (
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center space-x-2 shadow-lg shadow-blue-500/30"
              >
                <Save className="w-4 h-4" />
                <span>Simpan & Sinkronkan Data</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
