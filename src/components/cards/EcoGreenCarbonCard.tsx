import React from 'react';
import { GlassCard } from './GlassCard';
import { Leaf, Sparkles, Sun, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { BuildingData } from '../../types/city';

interface EcoGreenCarbonCardProps {
  building: BuildingData;
  isNightMode?: boolean;
}

export const EcoGreenCarbonCard: React.FC<EcoGreenCarbonCardProps> = ({ building, isNightMode = false }) => {
  const carbon = building.carbonEmission ?? Math.round(building.currentConsumption * 0.45);
  const ecoStatus = building.ecoStatus || (carbon < 220 ? 'Green' : carbon < 400 ? 'Warning' : 'High Emission');
  const solarShare = building.solarEnergyShare ?? (building.roofType === 'solar' ? 60 : 30);
  const aiRecommendation = building.aiEcoRecommendation || "Rekomendasi AI: Optimalkan mode hemat HVAC malam hari untuk mengurangi emisi 45 kg CO₂/hari.";

  return (
    <GlassCard isDark={isNightMode} className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm tracking-tight leading-tight">
              Indeks Hijau & Emisi
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Pemantauan Jejak Karbon
            </p>
          </div>
        </div>

        {/* Eco Status Badge */}
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 border ${
            ecoStatus === 'Green'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : ecoStatus === 'Warning'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
          }`}
        >
          {ecoStatus === 'Green' ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          ) : (
            <ShieldAlert className="w-3 h-3" />
          )}
          <span>{ecoStatus === 'Green' ? 'Ramah Lingkungan' : ecoStatus === 'Warning' ? 'Beban Sedang' : 'Emisi Tinggi'}</span>
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Carbon Footprint */}
        <div className="bg-slate-100/70 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mb-0.5">
            Emisi Karbon
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              {carbon}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">kg CO₂/hari</span>
          </div>
        </div>

        {/* Solar / Renewable Share */}
        <div className="bg-slate-100/70 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Energi Surya
            </span>
            <Sun className="w-3 h-3 text-amber-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {solarShare}%
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Terbarukan</span>
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-2.5 flex items-start space-x-2">
        <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-700 dark:text-slate-200 leading-snug">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-0.5">
            Rekomendasi AI
          </span>
          {aiRecommendation}
        </div>
      </div>
    </GlassCard>
  );
};
