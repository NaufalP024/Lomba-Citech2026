import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import { Terminal, Cpu, Camera, Box, X } from 'lucide-react';

export const DeveloperModeModal: React.FC = () => {
  const isDeveloperMode = useCityStore((state) => state.isDeveloperMode);
  const incrementLogoClicks = useCityStore((state) => state.incrementLogoClicks);
  const stats = useCityStore((state) => state.developerStats);
  const selectedBuildingId = useCityStore((state) => state.selectedBuildingId);

  if (!isDeveloperMode) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-slate-950/95 text-emerald-400 font-mono border border-emerald-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in duration-200 text-xs">
      <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-bold text-white tracking-wider">DEV_MODE ENGINE</span>
        </div>
        <button
          onClick={incrementLogoClicks}
          className="text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between">
          <span className="text-slate-400">Target Frame Rate:</span>
          <span className="font-bold text-emerald-300">{stats.fps} FPS (60.0)</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Triangles Rendered:</span>
          <span className="font-bold text-emerald-300">{stats.triangles.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Draw Calls:</span>
          <span className="font-bold text-emerald-300">{stats.drawCalls}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">VRAM Alloc:</span>
          <span className="font-bold text-emerald-300">{stats.memory} MB</span>
        </div>

        <div className="flex justify-between border-t border-emerald-500/20 pt-1.5">
          <span className="text-slate-400">Camera Vector:</span>
          <span className="font-bold text-cyan-300">
            [{stats.cameraPos.join(', ')}]
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Active Asset ID:</span>
          <span className="font-bold text-amber-300">
            {selectedBuildingId ? selectedBuildingId.toUpperCase() : 'NONE'}
          </span>
        </div>
      </div>
    </div>
  );
};
