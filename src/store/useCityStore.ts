import { create } from 'zustand';
import { BuildingData, BuildingStatus, InfraLayer, NavTab, SmartNotification } from '../types/city';
import initialBuildingsData from '../data/buildings.json';

interface CityState {
  buildings: BuildingData[];
  selectedBuildingId: string | null;
  hoveredBuildingId: string | null;
  focusedBuildingId: string | null;
  
  // Navigation & View
  activeTab: NavTab;
  activeLayer: InfraLayer | null;
  isNightMode: boolean;
  isMinimapOpen: boolean;
  isNotificationsOpen: boolean;
  isSearchOpen: boolean;
  isManageAssetOpen: boolean;
  isExportModalOpen: boolean;
  isShortcutHelpOpen: boolean;
  
  // Dev & Sound
  logoClickCount: number;
  isDeveloperMode: boolean;
  soundEnabled: boolean;
  developerStats: {
    fps: number;
    triangles: number;
    drawCalls: number;
    memory: number;
    cameraPos: [number, number, number];
  };

  // Live Notifications
  notifications: SmartNotification[];

  // Actions
  selectBuilding: (id: string | null) => void;
  hoverBuilding: (id: string | null) => void;
  toggleFocusMode: (id?: string) => void;
  setActiveTab: (tab: NavTab) => void;
  setActiveLayer: (layer: InfraLayer | null) => void;
  toggleNightMode: () => void;
  toggleMinimap: () => void;
  toggleNotifications: () => void;
  setSearchOpen: (open: boolean) => void;
  setManageAssetOpen: (open: boolean) => void;
  setExportModalOpen: (open: boolean) => void;
  setShortcutHelpOpen: (open: boolean) => void;
  toggleSound: () => void;
  incrementLogoClicks: () => void;
  updateBuildingData: (id: string, updates: Partial<BuildingData>) => void;
  updateDeveloperStats: (stats: Partial<CityState['developerStats']>) => void;
  simulateLiveUpdate: () => void;
  addNotification: (notif: Omit<SmartNotification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  resetCameraTrigger: number;
  triggerResetCamera: () => void;
}

export const useCityStore = create<CityState>((set, get) => ({
  buildings: initialBuildingsData as BuildingData[],
  selectedBuildingId: 'b-42', // Default select Skyline Plaza as in reference image
  hoveredBuildingId: null,
  focusedBuildingId: null,

  activeTab: 'Dashboard',
  activeLayer: null,
  isNightMode: false,
  isMinimapOpen: true,
  isNotificationsOpen: false,
  isSearchOpen: false,
  isManageAssetOpen: false,
  isExportModalOpen: false,
  isShortcutHelpOpen: false,

  logoClickCount: 0,
  isDeveloperMode: false,
  soundEnabled: false,
  developerStats: {
    fps: 60,
    triangles: 14280,
    drawCalls: 48,
    memory: 124,
    cameraPos: [15, 20, 25],
  },

  resetCameraTrigger: 0,
  triggerResetCamera: () => set((state) => ({ resetCameraTrigger: state.resetCameraTrigger + 1, focusedBuildingId: null })),

  notifications: [
    {
      id: 'n-1',
      type: 'warning',
      title: 'Power Load Spike',
      message: 'Skyline plaza (asset #B-42) power draw reached 412 kW.',
      timestamp: '19:40',
    },
    {
      id: 'n-2',
      type: 'info',
      title: 'Grid Optimization',
      message: 'Solar sub-grid active in sector East-4.',
      timestamp: '19:35',
    },
  ],

  selectBuilding: (id) => {
    set({ selectedBuildingId: id });
  },

  hoverBuilding: (id) => set({ hoveredBuildingId: id }),

  toggleFocusMode: (id) => {
    const currentFocus = get().focusedBuildingId;
    const targetId = id || get().selectedBuildingId || 'b-42';
    if (currentFocus === targetId) {
      set({ focusedBuildingId: null });
    } else {
      set({ focusedBuildingId: targetId, selectedBuildingId: targetId });
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setActiveLayer: (layer) => {
    const currentLayer = get().activeLayer;
    set({ activeLayer: currentLayer === layer ? null : layer });
  },

  toggleNightMode: () => set((state) => ({ isNightMode: !state.isNightMode })),

  toggleMinimap: () => set((state) => ({ isMinimapOpen: !state.isMinimapOpen })),

  toggleNotifications: () => set((state) => ({ isNotificationsOpen: !state.isNotificationsOpen })),

  setSearchOpen: (open) => set({ isSearchOpen: open }),

  setManageAssetOpen: (open) => set({ isManageAssetOpen: open }),

  setExportModalOpen: (open) => set({ isExportModalOpen: open }),

  setShortcutHelpOpen: (open) => set({ isShortcutHelpOpen: open }),

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  incrementLogoClicks: () => {
    const newCount = get().logoClickCount + 1;
    if (newCount >= 5) {
      set({ isDeveloperMode: !get().isDeveloperMode, logoClickCount: 0 });
    } else {
      set({ logoClickCount: newCount });
    }
  },

  updateBuildingData: (id, updates) => {
    set((state) => ({
      buildings: state.buildings.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  },

  updateDeveloperStats: (stats) => {
    set((state) => ({
      developerStats: { ...state.developerStats, ...stats },
    }));
  },

  addNotification: (notif) => {
    const newNotif: SmartNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications].slice(0, 10),
    }));
  },

  dismissNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  simulateLiveUpdate: () => {
    const { buildings, selectedBuildingId, addNotification } = get();
    if (!buildings.length) return;

    // Pick a random building to slightly adjust consumption/load
    const randomIndex = Math.floor(Math.random() * buildings.length);
    const target = buildings[randomIndex];

    const delta = (Math.random() - 0.48) * 15;
    const newConsumption = Math.max(100, Math.min(1000, Math.round(target.currentConsumption + delta)));
    const newTrend = delta > 2 ? 'Rising' : delta < -2 ? 'Falling' : 'Stable';

    // Update building
    const updatedHistory = [...target.powerHistory.slice(1), newConsumption];
    get().updateBuildingData(target.id, {
      currentConsumption: newConsumption,
      loadTrend: newTrend,
      powerHistory: updatedHistory,
    });

    // Randomly push live notification (20% chance)
    if (Math.random() < 0.25) {
      const types: ('info' | 'warning' | 'error' | 'success')[] = ['info', 'warning', 'success', 'info'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const sampleEvents = [
        { title: '⚡ Power Fluctuated', msg: `${target.name} grid draw adjusted to ${newConsumption} kW.` },
        { title: '💧 Pressure Valve Sync', msg: `${target.name} water supply stabilized at ${target.waterPressure} Bar.` },
        { title: '🏢 Occupancy Update', msg: `${target.name} reported active HVAC balancing.` },
        { title: '☀️ Solar Cell Feed', msg: `Sector roof arrays feeding ${Math.floor(Math.random() * 50 + 20)} kW.` },
      ];
      const ev = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      addNotification({
        type: randomType,
        title: ev.title,
        message: ev.msg,
      });
    }
  },
}));
