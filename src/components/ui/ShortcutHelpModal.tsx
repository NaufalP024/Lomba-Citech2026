import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import { Keyboard, X } from 'lucide-react';

export const ShortcutHelpModal: React.FC = () => {
  const isShortcutHelpOpen = useCityStore((state) => state.isShortcutHelpOpen);
  const setShortcutHelpOpen = useCityStore((state) => state.setShortcutHelpOpen);

  if (!isShortcutHelpOpen) return null;

  const shortcuts = [
    { key: 'F', desc: 'Enter / Exit Focus Mode on selected building' },
    { key: 'ESC', desc: 'Exit focus mode & close modals' },
    { key: 'R', desc: 'Reset 3D camera to default overview' },
    { key: 'M', desc: 'Toggle bottom-left Minimap view' },
    { key: 'N', desc: 'Toggle Smart Notifications drawer' },
    { key: 'L', desc: 'Cycle through Infrastructure Layers' },
    { key: '?', desc: 'Toggle this keyboard shortcut guide' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-500 text-white">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Keyboard Navigation
              </h2>
              <p className="text-xs text-slate-400">Control CityOS with hotkeys</p>
            </div>
          </div>
          <button
            onClick={() => setShortcutHelpOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {s.desc}
              </span>
              <kbd className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
