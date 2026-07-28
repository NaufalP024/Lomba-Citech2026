import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import incidentsData from '../../data/incidents.json';
import { AlertTriangle, ShieldAlert, Clock } from 'lucide-react';

export const IncidentsViewModal: React.FC = () => {
  const activeTab = useCityStore((state) => state.activeTab);
  const selectBuilding = useCityStore((state) => state.selectBuilding);
  const setActiveTab = useCityStore((state) => state.setActiveTab);

  if (activeTab !== 'Incidents') return null;

  const handleInspect = (buildingId: string) => {
    selectBuilding(buildingId);
    setActiveTab('Dashboard');
  };

  return (
    <div className="fixed top-16 sm:top-20 left-3 sm:left-6 right-3 lg:right-[410px] bottom-3 sm:bottom-6 z-30 bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Insiden Infrastruktur Aktif ({incidentsData.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Deteksi anomali sistem, penurunan tekanan, dan sirkulasi udara.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {incidentsData.map((inc) => (
          <div
            key={inc.id}
            className="bg-slate-50 dark:bg-slate-800/60 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 shrink-0">
                {inc.severity === 'critical' ? (
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                ) : inc.severity === 'high' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                ) : (
                  <Clock className="w-5 h-5 text-blue-500" />
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
                    {inc.title}
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      inc.severity === 'critical'
                        ? 'bg-rose-100 text-rose-600'
                        : inc.severity === 'high'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {inc.severity === 'critical' ? 'Kritis' : inc.severity === 'high' ? 'Tinggi' : 'Sedang'}
                  </span>
                </div>

                <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                  Gedung: {inc.buildingName} ({inc.buildingId.toUpperCase()})
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {inc.description}
                </p>

                <div className="text-[11px] text-slate-400 mt-2 font-mono flex items-center space-x-3">
                  <span>Dilaporkan: {inc.time}</span>
                  <span>•</span>
                  <span>Status: <strong className="text-slate-700 dark:text-slate-200">{inc.status}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleInspect(inc.buildingId)}
              className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shrink-0 shadow-sm text-center"
            >
              Lacak di 3D
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
