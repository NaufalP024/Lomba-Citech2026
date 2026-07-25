import React, { useEffect } from 'react';
import { useCityStore } from '../../store/useCityStore';
import { BuildingData } from '../../types/city';
import { Info, BarChart2, Zap, RotateCcw, X } from 'lucide-react';
import { playClickSound } from '../../utils/sound';

interface ContextMenuProps {
  x: number;
  y: number;
  building: BuildingData | null;
  onClose: () => void;
}

export const BuildingContextMenu: React.FC<ContextMenuProps> = ({ x, y, building, onClose }) => {
  const selectBuilding = useCityStore((state) => state.selectBuilding);
  const setActiveTab = useCityStore((state) => state.setActiveTab);
  const setActiveLayer = useCityStore((state) => state.setActiveLayer);
  const triggerResetCamera = useCityStore((state) => state.triggerResetCamera);
  const soundEnabled = useCityStore((state) => state.soundEnabled);

  useEffect(() => {
    const handleClickOutside = () => onClose();
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  if (!building) return null;

  const handleAction = (action: string) => {
    playClickSound(soundEnabled);
    if (action === 'details') {
      selectBuilding(building.id);
    } else if (action === 'analytics') {
      selectBuilding(building.id);
      setActiveTab('Analytics');
    } else if (action === 'infra') {
      setActiveLayer('electricity');
    } else if (action === 'reset') {
      triggerResetCamera();
    }
    onClose();
  };

  return (
    <div
      style={{ top: y, left: x }}
      className="fixed z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-slate-800 rounded-2xl p-1.5 shadow-2xl w-52 text-xs animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-between">
        <span className="truncate">{building.name}</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="py-1 space-y-0.5">
        <button
          onClick={() => handleAction('details')}
          className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-2 transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Inspect Building Details</span>
        </button>

        <button
          onClick={() => handleAction('analytics')}
          className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-2 transition-colors"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Show Detailed Analytics</span>
        </button>

        <button
          onClick={() => handleAction('infra')}
          className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-2 transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Highlight Grid Infrastructure</span>
        </button>

        <button
          onClick={() => handleAction('reset')}
          className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-2 transition-colors border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Camera View</span>
        </button>
      </div>
    </div>
  );
};
