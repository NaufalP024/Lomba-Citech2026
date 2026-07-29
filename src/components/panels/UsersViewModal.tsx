import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import analyticsData from '../../data/analytics.json';

const AVATAR_PALETTE = [
  'bg-blue-600 dark:bg-blue-500',
  'bg-emerald-600 dark:bg-emerald-500',
  'bg-indigo-600 dark:bg-indigo-500',
  'bg-amber-600 dark:bg-amber-500',
  'bg-rose-600 dark:bg-rose-500',
  'bg-cyan-600 dark:bg-cyan-500',
  'bg-purple-600 dark:bg-purple-500',
  'bg-teal-600 dark:bg-teal-500',
  'bg-violet-600 dark:bg-violet-500',
  'bg-sky-600 dark:bg-sky-500',
  'bg-pink-600 dark:bg-pink-500',
  'bg-fuchsia-600 dark:bg-fuchsia-500',
  'bg-orange-600 dark:bg-orange-500',
  'bg-lime-600 dark:bg-lime-500',
];

export const UsersViewModal: React.FC = () => {
  const activeTab = useCityStore((state) => state.activeTab);

  if (activeTab !== 'Users') return null;

  return (
    <div className="fixed top-16 sm:top-20 left-3 sm:left-6 right-3 lg:right-6 bottom-3 sm:bottom-6 z-30 bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Tim Pengelola Smart City ({analyticsData.users.length} Personel)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Direktori koordinator gedung dan teknisi pengelola digital twin Kabupaten Purwakarta.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {analyticsData.users.map((u, index) => {
          const colorClass = AVATAR_PALETTE[index % AVATAR_PALETTE.length];

          return (
            <div
              key={u.id}
              className="bg-slate-50 dark:bg-slate-800/60 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center space-x-3.5 hover:border-blue-500 transition-colors"
            >
              {/* Initials Avatar Circle Badge */}
              <div className="relative shrink-0">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${colorClass} text-white font-extrabold text-sm sm:text-base flex items-center justify-center shadow-md shadow-slate-900/10 tracking-wider`}
                >
                  {u.initials}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                    u.status === 'Aktif' || u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                  title={u.status}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate">
                  {u.name}
                </h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate mt-0.5">
                  {u.role}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate font-mono">
                  {u.email}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
