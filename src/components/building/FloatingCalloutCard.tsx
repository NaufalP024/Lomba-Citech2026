import React from 'react';
import { useCityStore } from '../../store/useCityStore';

export const FloatingCalloutCard: React.FC = () => {
  const selectedBuildingId = useCityStore((state) => state.selectedBuildingId);
  const buildings = useCityStore((state) => state.buildings);
  const activeTab = useCityStore((state) => state.activeTab);

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId);

  if (!selectedBuilding || activeTab !== 'Dashboard') return null;

  return (
    <div className="fixed top-28 left-3 right-3 md:top-40 md:left-6 md:right-auto md:w-80 z-20 pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
      {/* Callout Card */}
      <div className="bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-slate-800 rounded-3xl p-3.5 sm:p-4 shadow-[0_20px_50px_rgba(15,23,42,0.15)] space-y-2.5 sm:space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight leading-tight">
              {selectedBuilding.name} <span className="text-slate-400 text-[11px] font-normal">({selectedBuilding.code})</span>
            </h2>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          <span
            className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium ${
              selectedBuilding.status === 'Critical'
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                : selectedBuilding.status === 'Warning'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{selectedBuilding.statusLabel}</span>
          </span>
        </div>

        {/* Key Metrics List */}
        <div className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs border-t border-slate-200/60 dark:border-slate-800 pt-2 sm:pt-2.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Consumption:</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1">
              <span className="font-mono text-blue-600 dark:text-blue-400">{selectedBuilding.currentConsumption} kW</span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal">({selectedBuilding.loadTrend})</span>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Exterior Light:</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">
              {selectedBuilding.exteriorLight}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Water Pressure:</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">
              {selectedBuilding.waterPressure} Bar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
