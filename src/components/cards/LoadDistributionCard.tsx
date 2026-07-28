import React from 'react';
import { GlassCard } from './GlassCard';
import { LoadDistributionChart } from '../charts/LoadDistributionChart';
import { MoreVertical } from 'lucide-react';
import { BuildingData } from '../../types/city';

interface LoadDistributionCardProps {
  building: BuildingData;
  isNightMode?: boolean;
}

export const LoadDistributionCard: React.FC<LoadDistributionCardProps> = ({ building, isNightMode = false }) => {
  const dist = building.loadDistribution;

  return (
    <GlassCard isDark={isNightMode} className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm tracking-tight">
          Distribusi Beban Listrik
        </h3>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-3">
        {/* Donut Chart */}
        <div className="shrink-0">
          <LoadDistributionChart distribution={dist} isNightMode={isNightMode} />
        </div>

        {/* Legend List */}
        <div className="space-y-1.5 text-[11px] font-medium grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">Pencahayaan</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100">{dist.lighting}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">Pendingin Udara</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100">{dist.hvac}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-300 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">Peralatan Utilitas</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100">{dist.misc}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-700 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">Server & Perangkat IT</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100">{dist.itServers}%</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
