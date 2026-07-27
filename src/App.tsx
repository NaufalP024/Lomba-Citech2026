import React, { useState, useEffect } from 'react';
import { Navbar } from './components/navbar/Navbar';
import { TopHeaderOverlay } from './components/ui/TopHeaderOverlay';
import { CityScene } from './scene/CityScene';
import { FloatingCalloutCard } from './components/building/FloatingCalloutCard';
import { RightDashboardPanel } from './components/panels/RightDashboardPanel';
import { MiniMap } from './components/minimap/MiniMap';
import { SearchModal } from './components/navbar/SearchModal';
import { NotificationDrawer } from './components/navbar/NotificationDrawer';
import { ManageAssetModal } from './components/panels/ManageAssetModal';
import { ExportDataModal } from './components/panels/ExportDataModal';
import { GridViewModal } from './components/panels/GridViewModal';
import { AnalyticsViewModal } from './components/panels/AnalyticsViewModal';
import { IncidentsViewModal } from './components/panels/IncidentsViewModal';
import { UsersViewModal } from './components/panels/UsersViewModal';
import { DeveloperModeModal } from './components/panels/DeveloperModeModal';
import { ShortcutHelpModal } from './components/ui/ShortcutHelpModal';
import { BuildingContextMenu } from './components/building/BuildingContextMenu';
import { SplashScreen } from './components/ui/SplashScreen';
import { LiveNotificationStack } from './components/ui/LiveNotificationStack';
import { OnboardingTour } from './components/ui/OnboardingTour';
import { useCityStore } from './store/useCityStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { BuildingData } from './types/city';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const isNightMode = useCityStore((state) => state.isNightMode);
  const simulateLiveUpdate = useCityStore((state) => state.simulateLiveUpdate);
  const setTourOpen = useCityStore((state) => state.setTourOpen);

  // Activate hotkeys
  useKeyboardShortcuts();

  // Live simulation timer (PRD: every 5-10s random updates)
  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      simulateLiveUpdate();
    }, 6000);
    return () => clearInterval(interval);
  }, [isLoading, simulateLiveUpdate]);

  // Handle splash screen completion & auto-trigger onboarding tour every time web app loads
  const handleSplashComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setTourOpen(true);
    }, 400);
  };

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; building: BuildingData | null } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, building: BuildingData) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, building });
  };

  return (
    <div className={`relative w-screen h-screen overflow-hidden select-none ${isNightMode ? 'dark' : ''}`}>
      {/* 3D Scene rendered in background so models pre-load during Splash Loading Screen */}
      <CityScene onContextMenu={handleContextMenu} />

      {/* Loading Splash Screen Overlay */}
      {isLoading && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Main UI Overlay Controls & Modals */}
      {!isLoading && (
        <>
          {/* Top Navbar */}
          <Navbar />

          {/* Top Floating Control Sub-Header */}
          <TopHeaderOverlay />

          {/* Floating Building Callout Card */}
          <FloatingCalloutCard />

          {/* Right Dashboard Panel */}
          <RightDashboardPanel />

          {/* Bottom-Left Interactive Minimap */}
          <MiniMap />

          {/* Modals & Overlays */}
          <SearchModal />
          <NotificationDrawer />
          <ManageAssetModal />
          <ExportDataModal />
          <GridViewModal />
          <AnalyticsViewModal />
          <IncidentsViewModal />
          <UsersViewModal />
          <DeveloperModeModal />
          <ShortcutHelpModal />

          {/* Onboarding Feature Tour Modal */}
          <OnboardingTour />

          {/* Right-click Context Menu */}
          {contextMenu && (
            <BuildingContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              building={contextMenu.building}
              onClose={() => setContextMenu(null)}
            />
          )}

          {/* Toast Notification Container */}
          <LiveNotificationStack />
        </>
      )}
    </div>
  );
};

export default App;
