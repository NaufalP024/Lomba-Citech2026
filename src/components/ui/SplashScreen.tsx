import React, { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { progress: dreiProgress, active } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        // Target progress based on real 3D asset loading progress from useProgress
        const target = active ? Math.min(95, Math.max(prev + 5, Math.floor(dreiProgress))) : 100;
        if (prev >= 100 || (prev >= 98 && !active)) {
          clearInterval(interval);
          setIsFadingOut(true);
          setTimeout(onComplete, 600);
          return 100;
        }
        return Math.min(100, prev + Math.max(4, Math.floor((target - prev) * 0.3)));
      });
    }, 80);

    return () => clearInterval(interval);
  }, [dreiProgress, active, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#EEF3F8] dark:bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-500 pointer-events-auto ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-6 max-w-sm px-6">
        {/* Animated Brand Logo Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-blue-500 text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-bounce">
          <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
            <path d="M19 2H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2zm-7 3h3v3h-3V5zm-4 0h3v3H8V5zm0 5h3v3H8v-3zm0 5h3v3H8v-3zm9 3h-3v-3h3v3zm0-5h-3v-3h3v3zm0-5h-3V5h3v3z" />
          </svg>
          <Sparkles className="w-6 h-6 text-cyan-300 absolute -top-2 -right-2 animate-spin" />
        </div>

        {/* Title & Subtitle */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            SmartCity<span className="text-blue-500"> Vision</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Memuat aset 3D & telemetri kota Purwakarta...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-150"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>{displayProgress < 100 ? 'Rendering 3D Digital Twin...' : 'Siap! Membuka Dashboard...'}</span>
            <span className="font-bold text-blue-500">{displayProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
