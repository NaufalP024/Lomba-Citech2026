import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import { Bell, X, AlertTriangle, Info, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const isNotificationsOpen = useCityStore((state) => state.isNotificationsOpen);
  const toggleNotifications = useCityStore((state) => state.toggleNotifications);
  const notifications = useCityStore((state) => state.notifications);
  const dismissNotification = useCityStore((state) => state.dismissNotification);

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed top-16 right-6 z-50 w-96 bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/50 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-blue-500" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Notifikasi Sistem ({notifications.length})
          </h3>
        </div>
        <button
          onClick={toggleNotifications}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto p-3 space-y-2.5">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400">
            Tidak ada notifikasi aktif saat ini.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="relative group bg-slate-50/90 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex items-start space-x-3"
            >
              <div className="shrink-0 mt-0.5">
                {n.type === 'error' ? (
                  <XCircle className="w-5 h-5 text-rose-500" />
                ) : n.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                ) : n.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Info className="w-5 h-5 text-blue-500" />
                )}
              </div>

              <div className="grow pr-4">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-100 text-xs">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {n.message}
                </p>
              </div>

              <button
                onClick={() => dismissNotification(n.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all absolute top-3 right-3"
                title="Hapus"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
