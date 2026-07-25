import React from 'react';
import { GlassCard } from './GlassCard';
import { MoreVertical } from 'lucide-react';
import { BuildingData } from '../../types/city';

interface InfrastructureHealthCardProps {
  building: BuildingData;
  isNightMode?: boolean;
}

export const InfrastructureHealthCard: React.FC<InfrastructureHealthCardProps> = ({ building, isNightMode = false }) => {
  return (
    <GlassCard isDark={isNightMode} className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm tracking-tight">
          Infrastructure health
        </h3>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 text-xs">
        {/* HVAC Efficiency */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-600 dark:text-slate-300 font-medium">HVAC efficiency</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{building.hvacEfficiency}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${building.hvacEfficiency}%` }}
            />
          </div>
        </div>

        {/* Water supply */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Water supply</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{building.waterSupplyHealth}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${building.waterSupplyHealth}%` }}
            />
          </div>
        </div>

        {/* Fire safety */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Fire safety</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{building.fireSafetyHealth}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-700 dark:bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${building.fireSafetyHealth}%` }}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
