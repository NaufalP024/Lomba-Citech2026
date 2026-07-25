import React, { useState, useEffect } from 'react';
import { useCityStore } from '../../store/useCityStore';
import { ArrowLeft, MapPin, ChevronDown, FileText, Settings } from 'lucide-react';
import { playClickSound } from '../../utils/sound';

export const TopHeaderOverlay: React.FC = () => {
  const setManageAssetOpen = useCityStore((state) => state.setManageAssetOpen);
  const setExportModalOpen = useCityStore((state) => state.setExportModalOpen);
  const triggerResetCamera = useCityStore((state) => state.triggerResetCamera);
  const soundEnabled = useCityStore((state) => state.soundEnabled);
  const activeTab = useCityStore((state) => state.activeTab);

  const [timeStr, setTimeStr] = useState('17:00:53');
  const [district, setDistrict] = useState('Purwakarta, Jawa Barat');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (activeTab !== 'Dashboard') return null;

  const handleBack = () => {
    triggerResetCamera();
    playClickSound(soundEnabled);
  };

  return (
    <div className="fixed top-14 sm:top-20 left-3 sm:left-6 z-30 flex items-center space-x-2 sm:space-x-4 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300 max-w-[calc(100vw-24px)]">
      {/* Top Left Bar Info */}
      <div className="bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-slate-800 rounded-3xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-[0_15px_40px_rgba(15,23,42,0.12)] flex items-center space-x-2 sm:space-x-3.5">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors shrink-0"
          title="Reset Camera View"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>

        {/* Time & Date */}
        <div className="border-r border-slate-200/80 dark:border-slate-800 pr-2.5 sm:pr-3.5 shrink-0">
          <div className="flex items-baseline space-x-1 sm:space-x-1.5">
            <span className="font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs tracking-tight font-mono">
              {timeStr}
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden xs:inline">
              Oct 26, 2025
            </span>
          </div>
        </div>

        {/* Location Dropdown */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200">
          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-transparent appearance-none max-w-[110px] xs:max-w-[150px] sm:max-w-[190px] truncate pr-3.5 focus:outline-none cursor-pointer"
          >
            <option value="Purwakarta, Jawa Barat">Purwakarta, Jawa Barat</option>
            <option value="Kab. Purwakarta, Jabar">Kab. Purwakarta, Jabar</option>
            <option value="Bandung, Jawa Barat">Bandung, Jawa Barat</option>
            <option value="Jakarta, Indonesia">Jakarta, Indonesia</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none -ml-3" />
        </div>
      </div>

      {/* Top Right Action Buttons */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
        {/* Export Data Button */}
        <button
          onClick={() => {
            setExportModalOpen(true);
            playClickSound(soundEnabled);
          }}
          className="bg-white/85 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border border-white/60 dark:border-slate-700 shadow-md flex items-center space-x-1 transition-all hover:scale-105"
        >
          <FileText className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          <span className="hidden xs:inline">Export Data</span>
        </button>

        {/* Manage Asset Button */}
        <button
          onClick={() => {
            setManageAssetOpen(true);
            playClickSound(soundEnabled);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-md shadow-blue-500/30 flex items-center space-x-1 transition-all hover:scale-105"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Manage Asset</span>
        </button>
      </div>
    </div>
  );
};
