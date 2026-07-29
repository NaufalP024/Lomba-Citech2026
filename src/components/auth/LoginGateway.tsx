import React, { useState } from 'react';
import { useCityStore } from '../../store/useCityStore';
import analyticsData from '../../data/analytics.json';
import { Building2, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Lock, UserCheck } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
      {/* Ambient background glow elements */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-white/90 dark:bg-slate-900/90 border border-white/40 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-xl">
        {/* Left Side: Branding Banner */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />

          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/40">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-tight text-white">CityOS Digital Twin</h1>
                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                  Kabupaten Purwakarta
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-3">
              Portal Otentikasi Tim Pengelola
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sistem otentikasi hak akses terbatas berbasis peran (*Role-Based Access Control*). Hanya personel resmi terdaftar yang dapat mengelola fasilitas dan telemetri perkotaan.
            </p>
          </div>

          {/* Quick System Highlights */}
          <div className="mt-6 space-y-2.5 pt-6 border-t border-slate-800/80">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Akses Superadmin (Hak Kelola Seluruh Aset)</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Akses Koordinator Gedung (Isolasi Hak Kelola Fasilitas)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Account Selection & Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Pilih Akun Tim Pengelola
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pilih identitas Anda dari daftar 11 pengelola resmi terdaftar.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>Terverifikasi</span>
              </span>
            </div>

            {/* Personnel Account Selector List */}
            <div className="max-h-[310px] overflow-y-auto pr-1 space-y-2 mb-6">
              {analyticsData.users.map((user) => {
                const isSelected = selectedUserId === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUserId(user.id)}
                    className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-md'
                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${user.bgColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                        {user.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                            {user.name}
                          </span>
                          {user.isSuperAdmin && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500 text-white uppercase tracking-wider">
                              Superadmin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium truncate mt-0.5">
                          {user.role}
                        </p>
                      </div>
                    </div>

                    <div className="ml-2 shrink-0">
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 group-hover:border-blue-400 transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                <Lock className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Status Hak Akses:</span>
              </div>
              <strong className="text-slate-900 dark:text-white font-semibold">
                {selectedUser.isSuperAdmin
                  ? 'Akses Penuh (Edit Seluruh Gedung & Fitur)'
                  : `Akses Khusus (${selectedUser.assignedBuildingName})`}
              </strong>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30 transition-all"
            >
              <span>Masuk ke Portal Smart City</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
