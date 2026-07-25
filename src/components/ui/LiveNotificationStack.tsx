import React from 'react';
import { Toaster } from 'sonner';

export const LiveNotificationStack: React.FC = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: 'rounded-2xl border border-white/40 dark:border-slate-800 backdrop-blur-xl shadow-2xl font-sans text-xs',
        style: {
          background: 'rgba(255, 255, 255, 0.85)',
          color: '#0F172A',
        },
      }}
    />
  );
};
