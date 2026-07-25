import { useEffect } from 'react';
import { useCityStore } from '../store/useCityStore';
import { InfraLayer } from '../types/city';

export function useKeyboardShortcuts() {
  const toggleFocusMode = useCityStore((state) => state.toggleFocusMode);
  const triggerResetCamera = useCityStore((state) => state.triggerResetCamera);
  const toggleMinimap = useCityStore((state) => state.toggleMinimap);
  const toggleNotifications = useCityStore((state) => state.toggleNotifications);
  const activeLayer = useCityStore((state) => state.activeLayer);
  const setActiveLayer = useCityStore((state) => state.setActiveLayer);
  const setShortcutHelpOpen = useCityStore((state) => state.setShortcutHelpOpen);
  const isShortcutHelpOpen = useCityStore((state) => state.isShortcutHelpOpen);

  useEffect(() => {
    const layers: (InfraLayer | null)[] = [
      null,
      'electricity',
      'water',
      'hvac',
      'occupancy',
      'fire',
      'solar',
      'internet',
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toUpperCase();

      if (key === 'F') {
        toggleFocusMode();
      } else if (key === 'ESCAPE') {
        useCityStore.setState({ focusedBuildingId: null, isSearchOpen: false, isManageAssetOpen: false, isExportModalOpen: false, isShortcutHelpOpen: false });
      } else if (key === 'R') {
        triggerResetCamera();
      } else if (key === 'M') {
        toggleMinimap();
      } else if (key === 'N') {
        toggleNotifications();
      } else if (key === 'L') {
        const nextIdx = (layers.indexOf(activeLayer) + 1) % layers.length;
        setActiveLayer(layers[nextIdx]);
      } else if (e.key === '?') {
        setShortcutHelpOpen(!isShortcutHelpOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    toggleFocusMode,
    triggerResetCamera,
    toggleMinimap,
    toggleNotifications,
    activeLayer,
    setActiveLayer,
    setShortcutHelpOpen,
    isShortcutHelpOpen,
  ]);
}
