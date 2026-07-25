import React, { useState } from 'react';
import { useCityStore } from '../../store/useCityStore';
import { BuildingOccupancyCard } from '../cards/BuildingOccupancyCard';
import { RealTimePowerDrawCard } from '../cards/RealTimePowerDrawCard';
import { InfrastructureHealthCard } from '../cards/InfrastructureHealthCard';
import { LoadDistributionCard } from '../cards/LoadDistributionCard';
import { ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';

export const RightDashboardPanel: React.FC = () => {
  const selectedBuildingId = useCityStore((state) => state.selectedBuildingId);
  const buildings = useCityStore((state) => state.buildings);
  const isNightMode = useCityStore((state) => state.isNightMode);
  const activeTab = useCityStore((state) => state.activeTab);

  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId) || buildings[0];

  if (activeTab !== 'Dashboard') return null;

  return (
    <aside className="fixed bottom-4 left-3 right-3 lg:top-20 lg:right-6 lg:left-auto lg:bottom-6 z-30 lg:w-[380px] flex flex-col pointer-events-auto transition-all duration-300 max-h-[calc(100vh-100px)] lg:max-h-[calc(100vh-104px)]">
      {/* Mobile Drawer Header Toggle Button (Visible only on < lg screens) */}
      <div className="lg:hidden mb-2 flex justify-end shrink-0">
        <button
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-slate-800 text-slate-800 dark:text-white px-3 py-1.5 rounded-2xl shadow-lg text-xs font-semibold flex items-center space-x-1.5"
        >
          <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
          <span>{isMobileExpanded ? 'Hide Analytics' : 'Show Analytics'}</span>
          {isMobileExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Panel Content Scroll Area */}
      <div
        className={`overflow-y-auto h-full pr-1.5 space-y-3.5 sm:space-y-4 max-h-[65vh] lg:max-h-full ${
          isMobileExpanded ? 'block' : 'hidden lg:block'
        }`}
      >
        {/* Building Occupancy */}
        <BuildingOccupancyCard building={selectedBuilding} isNightMode={isNightMode} />

        {/* Real-time power draw */}
        <RealTimePowerDrawCard building={selectedBuilding} isNightMode={isNightMode} />

        {/* Infrastructure health */}
        <InfrastructureHealthCard building={selectedBuilding} isNightMode={isNightMode} />

        {/* Load distribution */}
        <LoadDistributionCard building={selectedBuilding} isNightMode={isNightMode} />
      </div>
    </aside>
  );
};
