import React, { useState } from 'react';
import { useCityStore } from '../../store/useCityStore';
import { Plus, Minus, Layers, MapPin } from 'lucide-react';
import { playClickSound } from '../../utils/sound';
import { InfraLayer } from '../../types/city';

export const MiniMap: React.FC = () => {
  const isMinimapOpen = useCityStore((state) => state.isMinimapOpen);
  const toggleMinimap = useCityStore((state) => state.toggleMinimap);
  const buildings = useCityStore((state) => state.buildings);
  const selectedBuildingId = useCityStore((state) => state.selectedBuildingId);
  const selectBuilding = useCityStore((state) => state.selectBuilding);
  const activeLayer = useCityStore((state) => state.activeLayer);
  const setActiveLayer = useCityStore((state) => state.setActiveLayer);
  const activeTab = useCityStore((state) => state.activeTab);
  const soundEnabled = useCityStore((state) => state.soundEnabled);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Only render minimap when on 3D Dashboard view
  if (!isMinimapOpen || activeTab !== 'Dashboard') return null;

  const handleBuildingClick = (id: string) => {
    selectBuilding(id);
    playClickSound(soundEnabled);
  };

  const layersList: { key: InfraLayer; label: string; icon: string }[] = [
    { key: 'electricity', label: 'Electricity Grid', icon: '⚡' },
    { key: 'water', label: 'Water Supply', icon: '💧' },
    { key: 'hvac', label: 'HVAC Airflow', icon: '❄️' },
    { key: 'occupancy', label: 'Occupancy Heatmap', icon: '👥' },
    { key: 'fire', label: 'Fire Safety', icon: '🔥' },
    { key: 'solar', label: 'Solar Panels', icon: '☀️' },
    { key: 'internet', label: 'Fiber Network', icon: '🌐' },
  ];

  return (
    <div className="fixed bottom-4 left-3 sm:bottom-6 sm:left-6 z-40 flex items-end space-x-2.5 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto max-w-[calc(100vw-24px)]">
      {/* Left Control Stack buttons */}
      <div className="flex flex-col space-y-1 bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-1 sm:p-1.5 rounded-2xl shadow-xl z-20 shrink-0">
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
          className="p-1.5 sm:p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title="Zoom In Minimap"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
          className="p-1.5 sm:p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title="Zoom Out Minimap"
        >
          <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`p-1.5 sm:p-2 rounded-xl transition-colors ${
              activeLayer
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
            title="Infrastructure Layers"
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Infrastructure Layer Popup Menu */}
          {showLayerMenu && (
            <div className="absolute bottom-12 left-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/80 dark:border-slate-800 rounded-2xl p-2 shadow-2xl w-48 sm:w-52 text-xs space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-2 py-1 border-b border-slate-100 dark:border-slate-800 mb-1">
                <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                  Infrastructure Layers
                </span>
                {activeLayer && (
                  <button
                    onClick={() => {
                      setActiveLayer(null);
                      setShowLayerMenu(false);
                    }}
                    className="text-[10px] text-blue-500 hover:underline font-medium"
                  >
                    Clear Layer
                  </button>
                )}
              </div>
              {layersList.map((l) => (
                <button
                  key={l.key}
                  onClick={() => {
                    setActiveLayer(l.key);
                    setShowLayerMenu(false);
                    playClickSound(soundEnabled);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-xl flex items-center justify-between transition-colors ${
                    activeLayer === l.key
                      ? 'bg-blue-500 text-white font-semibold shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{l.icon}</span>
                    <span className="truncate">{l.label}</span>
                  </span>
                  {activeLayer === l.key && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Minimap Display Card */}
      <div className="relative w-44 h-36 sm:w-56 sm:h-44 bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-slate-800 rounded-3xl p-1.5 sm:p-2 shadow-[0_20px_60px_rgba(15,23,42,0.14)] overflow-hidden shrink-0">
        {/* Canvas / Vector Grid Layout */}
        <div
          className="w-full h-full bg-slate-100 dark:bg-slate-950 rounded-2xl relative overflow-hidden transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Roads grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] dark:bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* Road Corridors */}
          <div className="absolute top-1/2 left-0 right-0 h-3.5 -translate-y-1/2 bg-slate-300/80 dark:bg-slate-900" />
          <div className="absolute left-1/2 top-0 bottom-0 w-3.5 -translate-x-1/2 bg-slate-300/80 dark:bg-slate-900" />

          {/* Render 2D Building Blocks */}
          {buildings.map((b) => {
            const isSel = b.id === selectedBuildingId;
            const leftPercent = 50 + (b.position[0] / 24) * 40;
            const topPercent = 50 + (b.position[2] / 24) * 40;

            return (
              <div
                key={`mini-${b.id}`}
                onClick={() => handleBuildingClick(b.id)}
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 rounded-sm ${
                  isSel
                    ? 'w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 ring-2 sm:ring-4 ring-cyan-400/60 shadow-lg shadow-blue-500/60 z-10'
                    : 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-slate-400 dark:bg-slate-700 hover:bg-blue-400 hover:scale-125'
                }`}
                title={`${b.name} (${b.code})`}
              >
                {isSel && (
                  <div className="w-full h-full flex items-center justify-center text-white text-[8px] font-bold">
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Map View Toggle Icon Button (bottom right) */}
        <button
          onClick={toggleMinimap}
          className="absolute bottom-2.5 right-2.5 w-6 h-6 sm:w-7 sm:h-7 bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-transform"
          title="Toggle Map View"
        >
          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
        </button>
      </div>
    </div>
  );
};
