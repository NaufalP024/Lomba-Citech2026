import React, { useState } from 'react';
import { useCityStore } from '../../store/useCityStore';
import { Search, X, Building2, Zap, ArrowRight } from 'lucide-react';
import { playClickSound } from '../../utils/sound';

export const SearchModal: React.FC = () => {
  const isSearchOpen = useCityStore((state) => state.isSearchOpen);
  const setSearchOpen = useCityStore((state) => state.setSearchOpen);
  const buildings = useCityStore((state) => state.buildings);
  const selectBuilding = useCityStore((state) => state.selectBuilding);
  const soundEnabled = useCityStore((state) => state.soundEnabled);

  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filtered = buildings.filter(
    (b) =>
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.code.toLowerCase().includes(query.toLowerCase()) ||
      b.type.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: string) => {
    selectBuilding(id);
    setSearchOpen(false);
    playClickSound(soundEnabled);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari gedung berdasarkan nama, kode (contoh: #B-42), atau kategori..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
            autoFocus
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/50">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Tidak ada gedung yang sesuai dengan "{query}"
            </div>
          ) : (
            filtered.map((b) => (
              <div
                key={b.id}
                onClick={() => handleSelect(b.id)}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-slate-800/70 cursor-pointer transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {b.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {b.code} • {b.type}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <div className="text-right">
                    <div className="font-mono font-medium text-slate-700 dark:text-slate-300">
                      {b.currentConsumption} kW
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        b.status === 'Critical'
                          ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400'
                          : b.status === 'Warning'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'
                          : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                      }`}
                    >
                      {b.statusLabel}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
