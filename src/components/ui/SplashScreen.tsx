import React, { useState, useEffect } from 'react';
import { Sparkles, Building2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20 + 10);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#EEF3F8] dark:bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-500">
      <div className="text-center space-y-6 max-w-sm px-6">
        {/* Animated Brand Logo Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-blue-500 text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-bounce">
          <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
            <path d="M19 2H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2zm-7 3h3v3h-3V5zm-4 0h3v3H8V5zm0 5h3v3H8v-3zm0 5h3v3H8v-3zm9 3h-3v-3h3v3zm0-5h-3v-3h3v3zm0-5h-3V5h3v3z" />
          </svg>
          <Sparkles className="w-6 h-6 text-cyan-300 absolute -top-2 -right-2 animate-spin" />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            City<span className="text-blue-500">OS</span> Digital Twin
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Initializing 3D spatial web application environment...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Loading 3D mesh assets</span>
            <span className="font-bold text-blue-500">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
