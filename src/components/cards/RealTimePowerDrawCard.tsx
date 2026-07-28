import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { PowerDrawChart } from '../charts/PowerDrawChart';
import { MoreVertical, ChevronDown, AlertTriangle } from 'lucide-react';
import { BuildingData } from '../../types/city';

interface RealTimePowerDrawCardProps {
  building: BuildingData;
  isNightMode?: boolean;
}

export const RealTimePowerDrawCard: React.FC<RealTimePowerDrawCardProps> = ({ building, isNightMode = false }) => {
  const [filter, setFilter] = useState('Real time');

  return (
    <GlassCard isDark={isNightMode} className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm tracking-tight">
          Konsumsi Daya Real-Time
        </h3>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs px-2.5 py-1 pr-6 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer focus:outline-none"
            >
              <option value="Real time">Real Time</option>
              <option value="Today">Hari Ini</option>
              <option value="7 Days">7 Hari Terakhir</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-center border-b border-slate-200/50 dark:border-slate-800 pb-3">
        <div>
          <div className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {building.peakConsumption} kW
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Beban Puncak</div>
        </div>

        <div>
          <div className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {building.currentConsumption} kW
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Beban Saat Ini</div>
        </div>

        <div>
          <div className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {building.alertsCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Peringatan</div>
        </div>
      </div>

      {/* Chart */}
      <div className="-mx-2 mb-3">
        <PowerDrawChart data={building.powerHistory} isNightMode={isNightMode} />
      </div>

      {/* Alert Banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 flex items-start space-x-2 text-[11px] text-amber-700 dark:text-amber-300">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <span className="leading-tight font-normal">
          {building.alertMessage}
        </span>
      </div>
    </GlassCard>
  );
};
