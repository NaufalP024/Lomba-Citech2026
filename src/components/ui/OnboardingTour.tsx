import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useCityStore } from '../../store/useCityStore';
import {
  ChevronRight,
  ChevronLeft,
  X,
  MapPin,
  BarChart3,
  Moon,

  CheckCircle2,
  Sparkles,
  Layers,
  MousePointerClick,
  Building2,
} from 'lucide-react';

interface FeatureStep {
  targetId: string | null;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  arrowPosition: 'top-center' | 'top-right' | 'bottom-right' | 'right-center' | 'center';
}

export const OnboardingTour: React.FC = () => {
  const isTourOpen = useCityStore((state) => state.isTourOpen);
  const tourStep = useCityStore((state) => state.tourStep);
  const setTourOpen = useCityStore((state) => state.setTourOpen);
  const nextTourStep = useCityStore((state) => state.nextTourStep);
  const prevTourStep = useCityStore((state) => state.prevTourStep);

  const [highlightRect, setHighlightRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);


  // 5 Step Onboarding Tour: Welcome Greeting & Key Application Features
  const steps: FeatureStep[] = [
    {
      targetId: null,
      title: 'Selamat Datang di SIGAP!',
      subtitle: 'SISTEM INFORMASI DAN PENGAWASAN GEDUNG PUBLIK',
      description:
        'Selamat datang di platform SIGAP (Sistem Informasi dan Pengawasan Gedung Publik) Kabupaten Purwakarta! Dashboard interaktif ini menyajikan monitoring 3D real-time untuk jaringan listrik, pasokan air, HVAC, keselamatan, serta infrastruktur gedung publik kota.',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      badge: 'Selamat Datang',
      arrowPosition: 'center',
    },
    {
      targetId: 'tour-navbar-tabs',
      title: 'Navigasi Tab Perkotaan',
      subtitle: 'Beralih Tampilan Utama',
      description:
        'Gunakan tab navbar ini untuk berpindah secara cepat antara Dashboard 3D, Peta Grid, Analitik, Insiden, dan Manajemen Personel.',
      icon: <MapPin className="w-5 h-5 text-blue-500" />,
      badge: 'Navbar Utama',
      arrowPosition: 'top-center',
    },
    {
      targetId: null,
      title: 'Interaksi Gedung & Kamera 3D',
      subtitle: 'Rotasi, Zoom & Detail Gedung',
      description:
        'Klik pada gedung 3D mana pun di peta untuk membuka panel telemetri real-time. Tahan & geser mouse untuk memutar sudut pandang dan scroll untuk zoom.',
      icon: <MousePointerClick className="w-5 h-5 text-emerald-500" />,
      badge: 'Kontrol 3D',
      arrowPosition: 'center',
    },

    {
      targetId: 'tour-analytics-panel',
      title: 'Panel Telemetri Real-Time',
      subtitle: 'Monitoring & Analitik Lengkap',
      description:
        'Pantau tingkat konsumsi daya (kW), tekanan air, efisiensi HVAC, dan okupansi gedung terpilih secara langsung dari panel ini. Selamat menjelajah!',
      icon: <BarChart3 className="w-5 h-5 text-cyan-500" />,
      badge: 'Telemetri',
      arrowPosition: 'right-center',
    },
  ];

  const currentStep = steps[tourStep] || steps[0];

  // Measure target element position
  const updateTargetRect = () => {
    if (!currentStep.targetId) {
      setHighlightRect(null);
      return;
    }
    const el = document.getElementById(currentStep.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setHighlightRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setHighlightRect(null);
    }
  };

  useLayoutEffect(() => {
    if (isTourOpen) updateTargetRect();
  }, [isTourOpen, tourStep]);

  useEffect(() => {
    if (!isTourOpen) return;
    window.addEventListener('resize', updateTargetRect);
    return () => window.removeEventListener('resize', updateTargetRect);
  }, [isTourOpen, tourStep]);

  // Elevate active target element AND its parent container ABOVE the dark backdrop overlay so it stays 100% bright, crisp, unblurred, and clear!
  useEffect(() => {
    if (!isTourOpen || !currentStep.targetId) return;

    const targetEl = document.getElementById(currentStep.targetId);
    if (targetEl) {
      const parentContainer = targetEl.closest('header, aside, div.fixed');
      const originalContainerZ = parentContainer ? (parentContainer as HTMLElement).style.zIndex : '';
      const originalTargetZ = targetEl.style.zIndex;
      const originalPosition = targetEl.style.position;

      if (parentContainer) {
        (parentContainer as HTMLElement).style.zIndex = '60';
      }
      targetEl.style.zIndex = '61';
      if (getComputedStyle(targetEl).position === 'static') {
        targetEl.style.position = 'relative';
      }

      targetEl.classList.add('ring-4', 'ring-blue-500', 'shadow-2xl', 'shadow-blue-500/40', 'bg-white', 'dark:bg-slate-900', 'transition-all');

      return () => {
        if (parentContainer) {
          (parentContainer as HTMLElement).style.zIndex = originalContainerZ;
        }
        targetEl.style.zIndex = originalTargetZ;
        targetEl.style.position = originalPosition;
        targetEl.classList.remove('ring-4', 'ring-blue-500', 'shadow-2xl', 'shadow-blue-500/40', 'bg-white', 'dark:bg-slate-900', 'transition-all');
      };
    }
  }, [isTourOpen, tourStep, currentStep.targetId]);

  // Handle keyboard hotkeys (Right = Next, Left = Back, Esc = Skip)
  useEffect(() => {
    if (!isTourOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (tourStep < steps.length - 1) nextTourStep();
      } else if (e.key === 'ArrowLeft') {
        if (tourStep > 0) prevTourStep();
      } else if (e.key === 'Escape') {
        setTourOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourOpen, tourStep, steps.length]);

  if (!isTourOpen) return null;

  const isFirstStep = tourStep === 0;
  const isLastStep = tourStep === steps.length - 1;

  // Calculate dynamic position class for tooltip box based on target
  let tooltipStyleClass = 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
  if (currentStep.targetId === 'tour-navbar-tabs') {
    tooltipStyleClass = 'top-20 left-1/2 -translate-x-1/2';
  } else if (currentStep.targetId === 'tour-analytics-panel') {
    tooltipStyleClass = 'top-28 left-4 sm:left-auto sm:right-[430px]';
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto select-none">
      {/* Crisp Dimmed Overlay (Target container sits above this at z-60) */}
      <div
        className="absolute inset-0 bg-slate-950/60 transition-opacity duration-300"
        onClick={() => setTourOpen(false)}
      />

      {/* Contextual Floating Tooltip Balloon */}
      <div
        key={tourStep}
        className={`fixed z-[70] w-[90vw] sm:w-[360px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/60 dark:border-slate-800 rounded-3xl p-5 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 ${tooltipStyleClass}`}
      >
        {/* Pointer Arrow indicator */}
        {currentStep.arrowPosition === 'top-center' && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-900 border-t border-l border-white/60 dark:border-slate-800 rotate-45" />
        )}
        {currentStep.arrowPosition === 'top-right' && (
          <div className="absolute -top-2 right-8 w-4 h-4 bg-white dark:bg-slate-900 border-t border-l border-white/60 dark:border-slate-800 rotate-45" />
        )}
        {currentStep.arrowPosition === 'bottom-right' && (
          <div className="absolute -top-2 right-6 w-4 h-4 bg-white dark:bg-slate-900 border-t border-l border-white/60 dark:border-slate-800 rotate-45" />
        )}
        {currentStep.arrowPosition === 'right-center' && (
          <div className="absolute top-8 -right-2 w-4 h-4 bg-white dark:bg-slate-900 border-t border-r border-white/60 dark:border-slate-800 rotate-45" />
        )}

        {/* Top Header Badge & Close Button */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {currentStep.badge}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {tourStep + 1} dari {steps.length}
            </span>
          </div>

          <button
            onClick={() => setTourOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Lewati Tur"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Description */}
        <div className="flex items-start space-x-3 mb-2.5">
          <div className="p-2 rounded-2xl bg-blue-50 dark:bg-slate-800 shrink-0">
            {currentStep.icon}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
              {currentStep.title}
            </h3>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
              {currentStep.subtitle}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {currentStep.description}
        </p>

        {/* Progress Dots */}
        <div className="flex items-center justify-center space-x-1.5 mb-4">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === tourStep
                  ? 'w-6 bg-blue-500'
                  : 'w-1.5 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setTourOpen(false)}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-white px-2 py-1 transition-colors"
          >
            Lewati
          </button>

          <div className="flex items-center space-x-1.5">
            {!isFirstStep && (
              <button
                onClick={prevTourStep}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
            )}

            {isLastStep ? (
              <button
                onClick={() => setTourOpen(false)}
                className="flex items-center space-x-1 px-4 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/30 transition-all hover:scale-105"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Selesai</span>
              </button>
            ) : (
              <button
                onClick={nextTourStep}
                className="flex items-center space-x-1 px-4 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/30 transition-all hover:scale-105"
              >
                <span>Lanjut</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
