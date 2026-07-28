import React from 'react';
import { GlassCard } from './GlassCard';
import { MoreVertical } from 'lucide-react';
import { BuildingData } from '../../types/city';

interface BuildingOccupancyCardProps {
  building: BuildingData;
  isNightMode?: boolean;
}

export const BuildingOccupancyCard: React.FC<BuildingOccupancyCardProps> = ({ building, isNightMode = false }) => {
  return (
    <GlassCard isDark={isNightMode} className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm tracking-tight">
          Profil & Kapasitas Gedung
        </h3>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">Kategori Gedung</span>
          <span className="font-semibold text-slate-800 dark:text-slate-100">{building.type}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">Luas Bangunan</span>
          <span className="font-semibold text-slate-800 dark:text-slate-100">{building.totalArea}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">Jumlah Unit / Tenant</span>
          <span className="font-semibold text-slate-800 dark:text-slate-100">{building.tenants}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">Tahun Beroperasi</span>
          <span className="font-semibold text-slate-800 dark:text-slate-100">{building.operationalSince}</span>
        </div>
      </div>
    </GlassCard>
  );
};
