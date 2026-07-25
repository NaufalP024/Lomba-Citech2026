import React, { useState, useEffect } from 'react';
import { useCityStore } from '../../store/useCityStore';
import { Settings, X, Save, Building2, Zap, Shield, Droplet } from 'lucide-react';
import { toast } from 'sonner';

export const ManageAssetModal: React.FC = () => {
  const isManageAssetOpen = useCityStore((state) => state.isManageAssetOpen);
  const setManageAssetOpen = useCityStore((state) => state.setManageAssetOpen);
  const selectedBuildingId = useCityStore((state) => state.selectedBuildingId);
  const buildings = useCityStore((state) => state.buildings);
  const updateBuildingData = useCityStore((state) => state.updateBuildingData);

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId) || buildings[0];

  const [name, setName] = useState(selectedBuilding.name);
  const [type, setType] = useState(selectedBuilding.type);
  const [status, setStatus] = useState(selectedBuilding.status);
  const [exteriorLight, setExteriorLight] = useState(selectedBuilding.exteriorLight);
  const [waterPressure, setWaterPressure] = useState(selectedBuilding.waterPressure);

  useEffect(() => {
    setName(selectedBuilding.name);
    setType(selectedBuilding.type);
    setStatus(selectedBuilding.status);
    setExteriorLight(selectedBuilding.exteriorLight);
    setWaterPressure(selectedBuilding.waterPressure);
  }, [selectedBuilding]);

  if (!isManageAssetOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBuildingData(selectedBuilding.id, {
      name,
      type,
      status: status as any,
      statusLabel: status === 'Normal' ? 'System Nominal' : status === 'Warning' ? 'High Load Warning' : 'Pressure Anomaly',
      exteriorLight,
      waterPressure: Number(waterPressure),
    });

    toast.success(`Asset "${name}" successfully updated!`, {
      description: 'Changes synchronized to digital twin grid.',
    });

    setManageAssetOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-500 text-white">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Manage Asset Details
              </h2>
              <p className="text-xs text-slate-400">
                {selectedBuilding.code} • {selectedBuilding.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setManageAssetOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Building Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Property Type
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Operational Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Normal">Normal (System Nominal)</option>
                <option value="Warning">Warning (High Load)</option>
                <option value="Critical">Critical (Anomaly Alert)</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Exterior Lighting State
              </label>
              <select
                value={exteriorLight}
                onChange={(e) => setExteriorLight(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ON (100%)">ON (100%)</option>
                <option value="ON (75%)">ON (75%)</option>
                <option value="ON (50%)">ON (50%)</option>
                <option value="OFF">OFF</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Water Pressure (Bar)
              </label>
              <input
                type="number"
                step="0.1"
                value={waterPressure}
                onChange={(e) => setWaterPressure(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setManageAssetOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center space-x-2 shadow-lg shadow-blue-500/30"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
