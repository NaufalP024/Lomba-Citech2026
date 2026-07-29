import React, { useState } from 'react';
import { useCityStore } from '../../store/useCityStore';
import analyticsData from '../../data/analytics.json';
import { Building2, ShieldCheck, ArrowRight, CheckCircle2, Lock, ChevronDown, UserCheck, BarChart3, PieChart } from 'lucide-react';
import { toast } from 'sonner';

interface LoginGatewayProps {
  onLoginSuccess: () => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({ onLoginSuccess }) => {
  const loginUser = useCityStore((state) => state.loginUser);
  const [selectedUserId, setSelectedUserId] = useState(analyticsData.users[0].id);
  const [rememberMe, setRememberMe] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedUser = analyticsData.users.find((u) => u.id === selectedUserId) || analyticsData.users[0];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginUser(selectedUserId);
    if (success) {
      toast.success(`Selamat datang kembali, ${selectedUser.name}!`, {
        description: `Hak akses: ${selectedUser.role}`,
      });
      onLoginSuccess();
    } else {
      toast.error('Gagal masuk. Pengguna tidak terdaftar!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      {/* Outer Card Container matching Reference UI */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-5xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* LEFT PANEL: Clean White Form Area (Matching Reference Image Left Column) */}
        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div>
            {/* Brand Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center space-x-1">
                  <span>City</span>
                  <span className="text-blue-600">OS</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 ml-1">
                    Purwakarta
                  </span>
                </h1>
              </div>
            </div>

            {/* Form Title & Subtitle */}
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
              Masuk Sistem
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Selamat datang kembali! Silakan pilih akun tim pengelola Anda.
            </p>

            {/* Form Container */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Account Dropdown Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pilih Akun Tim Pengelola (11 Personel Terdaftar)
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-left flex items-center justify-between hover:border-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl ${selectedUser.bgColor} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                        {selectedUser.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                            {selectedUser.name}
                          </span>
                          {selectedUser.isSuperAdmin && (
                            <span className="px-1.5 py-0.5 rounded-full text-[8px] font-black bg-amber-500 text-white uppercase tracking-wider">
                              Superadmin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium truncate">
                          {selectedUser.role}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Overlay */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-30 max-h-56 overflow-y-auto p-1.5 space-y-1">
                      {analyticsData.users.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            setSelectedUserId(u.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors ${
                            u.id === selectedUserId
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className={`w-7 h-7 rounded-lg ${u.bgColor} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                              {u.initials}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate flex items-center space-x-1.5">
                                <span>{u.name}</span>
                                {u.isSuperAdmin && (
                                  <span className="text-[8px] bg-amber-500 text-white px-1 rounded font-extrabold">SA</span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {u.role}
                              </div>
                            </div>
                          </div>
                          {u.id === selectedUserId && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 ml-1" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Access Badge Info Card */}
              <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-center space-x-3 text-xs">
                <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    Hak Otorisasi Sistem
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {selectedUser.isSuperAdmin
                      ? 'Penuh (Kelola Seluruh Gedung & Sistem)'
                      : `Khusus (${selectedUser.assignedBuildingName})`}
                  </span>
                </div>
              </div>

              {/* Remember for 30 Days Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Ingat Sesi Saya (30 Hari)</span>
                </label>
              </div>

              {/* Primary Blue Action Button matching Reference UI */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 mt-2"
              >
                <span>Masuk ke Portal Smart City</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Footer Subtext */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Dinas Komunikasi dan Informatika • Kabupaten Purwakarta
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Vibrant Royal Blue Banner with Mockup Graphic (Matching Reference Image Right Column) */}
        <div className="lg:col-span-7 bg-blue-600 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle background glow graphics */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700/50 rounded-full blur-3xl pointer-events-none" />

          {/* Header Text */}
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
              Selamat Datang Kembali!
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold text-blue-100 underline decoration-blue-300 underline-offset-8 mb-4">
              Portal Otentikasi CityOS Digital Twin
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
              Pusat komando dan kendali telemetri infrastruktur perkotaan terpadu Kabupaten Purwakarta berbasis kecerdasan digital twin 3D spatial.
            </p>
          </div>

          {/* Graphic Illustrated UI Dashboard Mockup Card (Floating inside Blue Banner matching reference image) */}
          <div className="relative z-10 my-6 bg-white rounded-3xl p-5 sm:p-6 text-slate-900 shadow-2xl border border-white/20 max-w-lg mx-auto w-full">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Laporan Konsumsi Energi & Telemetri</h4>
                <p className="text-[10px] text-slate-400">Kabupaten Purwakarta • Real-time Sync</p>
              </div>
              <div className="flex items-center space-x-2 text-[10px]">
                <span className="flex items-center space-x-1 font-semibold text-blue-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                  <span>Daya (kW)</span>
                </span>
                <span className="flex items-center space-x-1 text-slate-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-slate-200 inline-block" />
                  <span>Air (Bar)</span>
                </span>
              </div>
            </div>

            {/* Bar Chart & Category Graphic */}
            <div className="grid grid-cols-12 gap-4 items-end min-h-[120px]">
              
              {/* Simulated Bar Chart Columns */}
              <div className="col-span-8 flex items-end justify-between h-28 px-2 border-b border-slate-100 pb-1">
                {[
                  { month: 'Jan', height: '60%' },
                  { month: 'Feb', height: '45%' },
                  { month: 'Mar', height: '75%' },
                  { month: 'Apr', height: '50%' },
                  { month: 'May', height: '65%' },
                  { month: 'Jun', height: '85%' },
                  { month: 'Jul', height: '70%' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center space-y-1 group">
                    <div className="w-4 sm:w-5 bg-blue-100 rounded-t-sm relative flex items-end justify-center overflow-hidden" style={{ height: '90px' }}>
                      <div className="w-full bg-blue-600 rounded-t-sm transition-all" style={{ height: item.height }} />
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400">{item.month}</span>
                  </div>
                ))}
              </div>

              {/* Floating Category Donut Breakdown Card */}
              <div className="col-span-4 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Kategori Aset
                </span>
                <div className="relative w-14 h-14 rounded-full border-4 border-blue-600 border-t-amber-400 border-r-emerald-500 flex items-center justify-center my-1">
                  <span className="text-[9px] font-extrabold text-slate-800">10 Gedung</span>
                </div>
                <div className="flex items-center space-x-1 text-[8px] text-slate-500 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>Publik</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Kesehatan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Pagination Dots matching reference image */}
          <div className="relative z-10 flex items-center justify-center space-x-2 pt-2">
            <span className="w-6 h-1.5 rounded-full bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          </div>

        </div>

      </div>
    </div>
  );
};
