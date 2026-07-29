import React, { useState } from 'react';
import { useCityStore } from '../../store/useCityStore';
import analyticsData from '../../data/analytics.json';
import { Building2, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Lock, UserCheck, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface LoginGatewayProps {
  onLoginSuccess: () => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({ onLoginSuccess }) => {
  const loginUser = useCityStore((state) => state.loginUser);
  const [selectedUserId, setSelectedUserId] = useState(analyticsData.users[0].id);

  const selectedUser = analyticsData.users.find((u) => u.id === selectedUserId) || analyticsData.users[0];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginUser(selectedUserId);
    if (success) {
      toast.success(`Selamat datang, ${selectedUser.name}!`, {
        description: `Akses diberikan sebagai ${selectedUser.role}.`,
      });
      onLoginSuccess();
    } else {
      toast.error('Gagal masuk. Pengguna tidak terdaftar!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/45 dark:bg-slate-950/55 backdrop-blur-md animate-in fade-in duration-300">
      {/* Animated Futuristic Sci-Fi Cyber Grid & Particles Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/40 to-slate-950/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Live Animated City Status Pill Badge */}
      <div className="absolute top-4 left-4 sm:left-6 z-10 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-white text-[11px] font-bold flex items-center space-x-2 shadow-lg backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        <span className="tracking-wide">LIVE ANIMATION 3D DIGITAL TWIN KAB. PURWAKARTA</span>
      </div>

      {/* Compact Main Login Card Box */}
      <div className="relative bg-white/85 dark:bg-slate-900/85 border border-white/50 dark:border-slate-800/80 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 backdrop-blur-xl animate-in zoom-in-95 duration-200">
        
        {/* Left Side: Compact Brand & Intro Banner */}
        <div className="md:col-span-5 p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/40 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-tight text-white leading-tight">CityOS Digital Twin</h1>
                <span className="text-[9px] font-bold tracking-widest text-blue-400 uppercase">
                  Kabupaten Purwakarta
                </span>
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-bold leading-snug mb-2 text-white">
              Portal Otentikasi Tim Pengelola
            </h2>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Otentikasi hak akses terbatas berbasis peran (*RBAC*). Hanya pengelola resmi terdaftar yang dapat mengubah data telemetri perkotaan.
            </p>
          </div>

          {/* Quick System Highlights */}
          <div className="mt-4 space-y-2 pt-4 border-t border-slate-800/80">
            <div className="flex items-center space-x-2 text-[11px] text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Superadmin (Budi Santoso - Kominfo)</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Koordinator Gedung (Akses Terisolasi)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Account Selector & Login Action */}
        <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Pilih Akun Tim Pengelola
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Daftar 11 personel resmi terdaftar.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center space-x-1 shrink-0">
                <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                <span>11 User Resmi</span>
              </span>
            </div>

            {/* Compact Account List (Scrollable) */}
            <div className="max-h-[200px] sm:max-h-[220px] overflow-y-auto pr-1 space-y-1.5 mb-4">
              {analyticsData.users.map((user) => {
                const isSelected = selectedUserId === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUserId(user.id)}
                    className={`w-full p-2.5 rounded-xl border transition-all text-left flex items-center justify-between group ${
                      isSelected
                        ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-500 shadow-sm ring-1 ring-blue-500/30'
                        : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg ${user.bgColor} text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-sm`}>
                        {user.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                            {user.name}
                          </span>
                          {user.isSuperAdmin && (
                            <span className="px-1.5 py-0.2 rounded-full text-[8px] font-extrabold bg-amber-500 text-white uppercase tracking-wider shrink-0">
                              Superadmin
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium truncate">
                          {user.role}
                        </p>
                      </div>
                    </div>

                    <div className="ml-1.5 shrink-0">
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 group-hover:border-blue-400 transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form Action */}
          <form onSubmit={handleLoginSubmit} className="space-y-2.5 pt-3 border-t border-slate-200/60 dark:border-slate-800">
            <div className="p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 truncate">
                <Lock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">Hak Akses:</span>
              </div>
              <strong className="text-slate-900 dark:text-white font-semibold truncate ml-1">
                {selectedUser.isSuperAdmin
                  ? 'Superadmin (Akses Penuh)'
                  : `Akses (${selectedUser.assignedBuildingName})`}
              </strong>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-500/30 transition-all"
            >
              <span>Masuk ke Portal Smart City</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
