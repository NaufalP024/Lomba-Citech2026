import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useCityStore } from '../../store/useCityStore';
import { NavTab } from '../../types/city';
import { Search, Bell, Moon, Sun, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { playClickSound } from '../../utils/sound';

export const Navbar: React.FC = () => {
  const activeTab = useCityStore((state) => state.activeTab);
  const setActiveTab = useCityStore((state) => state.setActiveTab);
  const isNightMode = useCityStore((state) => state.isNightMode);
  const toggleNightMode = useCityStore((state) => state.toggleNightMode);
  const soundEnabled = useCityStore((state) => state.soundEnabled);
  const toggleSound = useCityStore((state) => state.toggleSound);
  
  const setSearchOpen = useCityStore((state) => state.setSearchOpen);
  const toggleNotifications = useCityStore((state) => state.toggleNotifications);
  const notifications = useCityStore((state) => state.notifications);
  const setShortcutHelpOpen = useCityStore((state) => state.setShortcutHelpOpen);
  const incrementLogoClicks = useCityStore((state) => state.incrementLogoClicks);

  const tabs: NavTab[] = ['Dashboard', 'Grid', 'Analytics', 'Incidents', 'Users'];
  const activeIndex = Math.max(0, tabs.indexOf(activeTab));

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  // Update sliding pill position and dynamic width based on exact active tab button dimensions
  const updatePill = () => {
    const activeEl = tabRefs.current[activeIndex];
    if (activeEl) {
      setPillStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  };

  useLayoutEffect(() => {
    updatePill();
  }, [activeTab, activeIndex]);

  useEffect(() => {
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [activeTab, activeIndex]);

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    playClickSound(soundEnabled);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/40 dark:border-slate-800 shadow-sm transition-colors duration-300">
      {/* Brand Logo */}
      <div
        className="flex items-center space-x-2 cursor-pointer group select-none shrink-0"
        onClick={incrementLogoClicks}
        title="Click 5 times for Developer Mode"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19 2H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2zm-7 3h3v3h-3V5zm-4 0h3v3H8V5zm0 5h3v3H8v-3zm0 5h3v3H8v-3zm9 3h-3v-3h3v3zm0-5h-3v-3h3v3zm0-5h-3V5h3v3z" />
          </svg>
        </div>
        <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          City<span className="text-blue-500">OS</span>
        </span>
      </div>

      {/* Animated Dynamic-Width Sliding Pill Navigation Segment Control */}
      <nav className="relative flex items-center space-x-1 bg-slate-100/70 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-x-auto no-scrollbar max-w-[50vw] sm:max-w-none">
        {/* Dynamic Width Sliding Active Pill Background Indicator */}
        <div
          className="absolute top-1 bottom-1 rounded-lg bg-blue-500 shadow-md shadow-blue-500/30 transition-all duration-300 ease-out pointer-events-none"
          style={{
            left: `${pillStyle.left}px`,
            width: `${pillStyle.width}px`,
          }}
        />

        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              ref={(el) => (tabRefs.current[idx] = el)}
              onClick={() => handleTabClick(tab)}
              className={`relative z-10 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors duration-200 text-center select-none ${
                isActive
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center space-x-1 sm:space-x-2.5 shrink-0">
        {/* Day/Night Toggle */}
        <button
          onClick={toggleNightMode}
          className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title={isNightMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
        >
          {isNightMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Mute/Unmute Sound */}
        <button
          onClick={toggleSound}
          className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors hidden xs:block"
          title={soundEnabled ? 'Mute UI Sounds' : 'Enable UI Sounds'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Keyboard Shortcuts Help */}
        <button
          onClick={() => setShortcutHelpOpen(true)}
          className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors hidden sm:block"
          title="Keyboard Shortcuts (Press ?)"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Search Modal Trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title="Search Buildings"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={toggleNotifications}
          className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {notifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          )}
        </button>

        {/* User Initials Avatar Badge (Budi Santoso) */}
        <div className="relative pl-0.5 sm:pl-1">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-500/40 shadow-sm select-none"
            title="Budi Santoso (Admin)"
          >
            BS
          </div>
          <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
        </div>
      </div>
    </header>
  );
};
