import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useCityStore } from '../../store/useCityStore';
import { NavTab } from '../../types/city';
import { Search, Bell, HelpCircle, Compass, LogOut, Menu, X, ChevronRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const activeTab = useCityStore((state) => state.activeTab);
  const setActiveTab = useCityStore((state) => state.setActiveTab);
  
  const setSearchOpen = useCityStore((state) => state.setSearchOpen);
  const toggleNotifications = useCityStore((state) => state.toggleNotifications);
  const notifications = useCityStore((state) => state.notifications);
  const setShortcutHelpOpen = useCityStore((state) => state.setShortcutHelpOpen);
  const setTourOpen = useCityStore((state) => state.setTourOpen);
  const incrementLogoClicks = useCityStore((state) => state.incrementLogoClicks);

  const currentUser = useCityStore((state) => state.currentUser);
  const logoutUser = useCityStore((state) => state.logoutUser);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs: NavTab[] = ['Dashboard', 'Grid', 'Analytics', 'Incidents', 'Users'];
  const tabDisplayNames: Record<NavTab, string> = {
    Dashboard: 'Beranda 3D',
    Grid: 'Peta Jaringan',
    Analytics: 'Analisis Kota',
    Incidents: 'Laporan Insiden',
    Users: 'Tim Pengelola',
  };

  const activeIndex = Math.max(0, tabs.indexOf(activeTab));
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  // Update sliding pill position and dynamic width on desktop
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
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border-b border-white/40 dark:border-slate-800 shadow-sm transition-colors duration-300">
      
      {/* Brand Logo */}
      <div
        className="flex items-center space-x-2 cursor-pointer group select-none shrink-0 mr-4 sm:mr-6"
        onClick={incrementLogoClicks}
        title="Klik 5 kali untuk Mode Developer"
      >
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform shrink-0">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19 2H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2zm-7 3h3v3h-3V5zm-4 0h3v3H8V5zm0 5h3v3H8v-3zm0 5h3v3H8v-3zm9 3h-3v-3h3v3zm0-5h-3v-3h3v3zm0-5h-3V5h3v3z" />
          </svg>
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-lg sm:text-xl font-extrabold tracking-wider text-slate-900 dark:text-white leading-none">
            SIG<span className="text-blue-600">AP</span>
          </span>
          <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 tracking-tighter leading-none hidden 2xl:block mt-0.5 whitespace-nowrap">
            Sistem Informasi & Pengawasan Gedung Publik
          </span>
        </div>
      </div>

      {/* DESKTOP: Dynamic-Width Sliding Pill Navigation Segment Control (Hidden on Mobile/Tablet) */}
      <nav
        id="tour-navbar-tabs"
        className="hidden md:flex relative items-center space-x-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50"
      >
        {/* Dynamic Width Sliding Active Pill Background Indicator */}
        <div
          className="absolute top-1 bottom-1 rounded-lg bg-blue-600 shadow-md shadow-blue-600/30 transition-all duration-300 ease-out pointer-events-none"
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
              className={`relative z-10 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors duration-200 text-center select-none ${
                isActive
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tabDisplayNames[tab]}
            </button>
          );
        })}
      </nav>

      {/* DESKTOP & TABLET CONTROLS (Right Column) */}
      <div className="hidden lg:flex items-center space-x-2 shrink-0">
        {/* Onboarding Tutorial Tour Trigger */}
        <button
          onClick={() => setTourOpen(true)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1"
          title="Tur Panduan Interaktif"
        >
          <Compass className="w-4 h-4 text-blue-500 animate-pulse" />
        </button>


        {/* Keyboard Shortcuts Help */}
        <button
          onClick={() => setShortcutHelpOpen(true)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title="Pintas Kunci Keyboard (Tekan ?)"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Search Modal Trigger */}
        <button
          id="tour-search-button"
          onClick={() => setSearchOpen(true)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title="Cari Bangunan"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={toggleNotifications}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors relative"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          {notifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          )}
        </button>

        {/* Logged-in User Profile Badge & Logout Button */}
        {currentUser && (
          <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full ${currentUser.bgColor || 'bg-blue-600'} text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-500/30 shadow-sm select-none`}
                  title={`${currentUser.name} (${currentUser.role})`}
                >
                  {currentUser.initials}
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight truncate max-w-[110px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-medium text-blue-600 dark:text-blue-400 leading-tight truncate max-w-[110px]">
                  {currentUser.isSuperAdmin ? 'Superadmin' : currentUser.assignedBuildingName}
                </div>
              </div>
            </div>

            <button
              onClick={logoutUser}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              title="Keluar dari Akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* MOBILE & TABLET: BURGER MENU BUTTON (Visible on < lg screens) */}
      <div className="flex lg:hidden items-center space-x-2">
        {/* Quick Search trigger on mobile */}
        <button
          onClick={() => setSearchOpen(true)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title="Cari Gedung"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Burger Button Icon Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center"
          title="Buka Menu Navigasi"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE SLIDE-DOWN BURGER NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-3 right-3 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          
          {/* User Profile Card */}
          {currentUser && (
            <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl ${currentUser.bgColor || 'bg-blue-600'} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm`}>
                  {currentUser.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] font-medium text-blue-600 dark:text-blue-400 truncate">
                    {currentUser.role}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logoutUser();
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center space-x-1.5 hover:bg-rose-500/20 transition-colors shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          )}

          {/* Navigation Links Vertical List */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block px-1 mb-1">
              Menu Navigasi Utam
            </span>
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`w-full p-3 rounded-2xl text-xs font-bold text-left flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{tabDisplayNames[tab]}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Quick Action Grid Icons */}
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block px-1 mb-2">
              Pengaturan & Alat
            </span>
            <div className="grid grid-cols-4 gap-2">

              <button
                onClick={() => {
                  setTourOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex flex-col items-center justify-center space-y-1 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                title="Tur Panduan"
              >
                <Compass className="w-4 h-4 text-blue-500" />
                <span className="text-[9px] font-semibold">Tur</span>
              </button>

              <button
                onClick={() => {
                  toggleNotifications();
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex flex-col items-center justify-center space-y-1 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors relative"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4 text-rose-500" />
                <span className="text-[9px] font-semibold">Notif</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </header>
  );
};
