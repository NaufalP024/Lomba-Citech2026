import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import { ArrowRight } from 'lucide-react';

export const GridViewModal: React.FC = () => {
  const activeTab = useCityStore((state) => state.activeTab);
  const buildings = useCityStore((state) => state.buildings);
  const selectBuilding = useCityStore((state) => state.selectBuilding);
  const setActiveTab = useCityStore((state) => state.setActiveTab);

  if (activeTab !== 'Grid') return null;

  const handleSelectBuilding = (id: string) => {
    selectBuilding(id);
    setActiveTab('Dashboard');
  };

  return (
    <div className="fixed top-16 sm:top-20 left-3 sm:left-6 right-3 lg:right-[410px] bottom-3 sm:bottom-6 z-30 bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Grid Infrastruktur Kota ({buildings.length} Aset)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ringkasan status infrastruktur seluruh sektor kota.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {buildings.map((b) => (
          <div
            key={b.id}
            onClick={() => handleSelectBuilding(b.id)}
            className="bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-md">
                {b.code}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  b.status === 'Critical'
                    ? 'bg-rose-100 text-rose-600'
                    : b.status === 'Warning'
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-emerald-100 text-emerald-600'
                }`}
              >
                {b.statusLabel}
              </span>
            </div>

            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              {b.name}
            </h3>
            <p className="text-xs text-slate-400 mb-3">{b.type}</p>

            <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200/50 dark:border-slate-700/50 pt-2 font-mono">
              <div>
                <div className="text-[10px] text-slate-400 font-sans">Konsumsi Daya</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{b.currentConsumption} kW</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-sans">Kepadatan</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{b.occupancy}%</div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end text-xs text-blue-500 font-medium group-hover:translate-x-1 transition-transform">
              <span>Lihat 3D</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
