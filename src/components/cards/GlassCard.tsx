import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, isDark = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-[24px] p-5 transition-all duration-300',
          isDark
            ? 'bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 text-white shadow-2xl'
            : 'bg-white/75 backdrop-blur-[20px] border border-white/50 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.12)] hover:shadow-[0_25px_70px_rgba(15,23,42,0.16)]',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
