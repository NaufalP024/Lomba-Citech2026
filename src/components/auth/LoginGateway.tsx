import React, { useState } from 'react';
import { useCityStore } from '../../store/useCityStore';
import analyticsData from '../../data/analytics.json';
import { Building2, ShieldCheck, ArrowRight, CheckCircle2, Lock, ChevronDown, UserCheck, Sparkles, MapPin } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 w-full h-full bg-slate-950 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden select-none">
      
      {/* LEFT COLUMN: Clean White/Slate Form Area (Full screen centered on Mobile HP, Split side on Desktop) */}
      <div className="w-full lg:w-5/12 xl:w-4/12 h-full min-h-screen bg-white dark:bg-slate-900 p-6 sm:p-10 lg:p-12 flex flex-col justify-between z-10 shadow-2xl shrink-0 overflow-y-auto">
        <div className="max-w-md mx-auto w-full my-auto py-4">
          
          {/* Brand Header */}
          <div className="flex items-center space-x-3 mb-8 lg:mb-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/30 shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl lg:text-2xl tracking-tight text-slate-900 dark:text-white flex items-center space-x-1.5">
                <span>SIGAP</span>
                <span className="text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 ml-1 uppercase tracking-wider">
                  Purwakarta
                </span>
              </h1>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-400">SISTEM INFORMASI DAN PENGAWASAN GEDUNG PUBLIK</p>
            </div>
          </div>

          {/* Form Title */}
          <div className="mb-6 lg:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Masuk Sistem
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Selamat datang kembali! Silakan pilih akun tim pengelola Anda.
            </p>
          </div>

          {/* Form Container */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 lg:space-y-5">
            
            {/* Account Selector Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Pilih Akun Tim Pengelola (11 Personel Terdaftar)
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-left flex items-center justify-between hover:border-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${selectedUser.bgColor} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                      {selectedUser.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                          {selectedUser.name}
                        </span>
                        {selectedUser.isSuperAdmin && (
                          <span className="px-2 py-0.5 rounded-full text-[8px] font-black bg-amber-500 text-white uppercase tracking-wider">
                            Superadmin
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 font-medium truncate mt-0.5">
                        {selectedUser.role}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu List */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-40 max-h-60 overflow-y-auto p-2 space-y-1">
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
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className={`w-8 h-8 rounded-lg ${u.bgColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                            {u.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate flex items-center space-x-1.5">
                              <span>{u.name}</span>
                              {u.isSuperAdmin && (
                                <span className="text-[8px] bg-amber-500 text-white px-1.5 rounded font-extrabold">SA</span>
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

            {/* Authority Status Card */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center space-x-3.5 text-xs">
              <div className="p-2 sm:p-2.5 rounded-xl bg-blue-600 text-white shrink-0 shadow-sm">
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <span className="text-[9px] sm:text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  Hak Otorisasi Sistem
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-xs">
                  {selectedUser.isSuperAdmin
                    ? 'Superadmin (Akses Kelola Seluruh Gedung)'
                    : `Akses Khusus (${selectedUser.assignedBuildingName})`}
                </span>
              </div>
            </div>

            {/* Checkbox Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Ingat Sesi Saya (30 Hari)</span>
              </label>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 mt-4"
            >
              <span>Masuk ke Portal SIGAP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Subtext */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center sm:text-left mt-8">
            <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">
              © 2026 Dinas Komunikasi dan Informatika • Kabupaten Purwakarta
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Real Purwakarta Webp Image Banner (HIDDEN ON MOBILE HP, VISIBLE ON DESKTOP LG) */}
      <div className="hidden lg:flex lg:w-7/12 xl:w-8/12 lg:h-full relative overflow-hidden bg-slate-950 flex-col justify-between p-8 sm:p-12 lg:p-16 shrink-0">
        
        {/* Background Image: Purwakarta.webp */}
        <img
          src="/purwakarta.webp"
          alt="Kota Purwakarta Smart City"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-90 transition-transform duration-10000 ease-out"
        />

        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-blue-950/40 pointer-events-none" />

        {/* Top Header Badge inside Image */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="px-4 py-2 rounded-full bg-slate-900/80 border border-white/20 text-white text-xs font-bold backdrop-blur-md flex items-center space-x-2 shadow-lg">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Kabupaten Purwakarta, Jawa Barat</span>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-blue-600/80 text-white text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md">
            Digital Twin 3D
          </span>
        </div>

        {/* Bottom Banner Content over Purwakarta Image */}
        <div className="relative z-10 max-w-2xl mt-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-md">
            Selamat Datang Kembali!
          </h2>
          <h3 className="text-xl sm:text-2xl font-bold text-blue-300 underline decoration-blue-400 underline-offset-8 mb-4">
            Portal Otentikasi SIGAP Purwakarta
          </h3>
          <p className="text-xs sm:text-base text-slate-200 leading-relaxed font-normal mb-8 drop-shadow">
            SISTEM INFORMASI DAN PENGAWASAN GEDUNG PUBLIK terpadu Kabupaten Purwakarta berbasis kecerdasan digital twin spatial 3D.
          </p>

          {/* Quick Stats Badges Over Image */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/20">
            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
              <span className="text-lg sm:text-2xl font-extrabold text-white block">10 Gedung</span>
              <span className="text-[10px] sm:text-xs text-blue-300 font-medium">Fasilitas Utama</span>
            </div>
            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
              <span className="text-lg sm:text-2xl font-extrabold text-emerald-400 block">11 Personel</span>
              <span className="text-[10px] sm:text-xs text-slate-300 font-medium">Tim Pengelola</span>
            </div>
            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
              <span className="text-lg sm:text-2xl font-extrabold text-blue-400 block">Real-time</span>
              <span className="text-[10px] sm:text-xs text-slate-300 font-medium">Telemetri Kota</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
