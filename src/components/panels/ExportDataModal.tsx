import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import { Download, X, FileCode, FileSpreadsheet, FileText } from 'lucide-react';
import { exportCityDataPDF, exportCityDataCSV, exportCityDataJSON } from '../../utils/exportUtils';
import { toast } from 'sonner';

export const ExportDataModal: React.FC = () => {
  const isExportModalOpen = useCityStore((state) => state.isExportModalOpen);
  const setExportModalOpen = useCityStore((state) => state.setExportModalOpen);
  const buildings = useCityStore((state) => state.buildings);

  if (!isExportModalOpen) return null;

  const handleExportPDF = () => {
    toast.info('Membuat Dokumen PDF...', {
      description: 'Menyusun laporan resmi telemetri perkotaan...',
    });
    exportCityDataPDF(buildings);
    setExportModalOpen(false);
  };

  const handleExportCSV = () => {
    toast.info('Proses ekspor dimulai.', {
      description: 'Membuat lembar kerja CSV...',
    });
    exportCityDataCSV(buildings);
    setExportModalOpen(false);
  };

  const handleExportJSON = () => {
    toast.info('Proses ekspor dimulai.', {
      description: 'Membuat laporan data JSON...',
    });
    exportCityDataJSON(buildings);
    setExportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-500 text-white shadow-md shadow-blue-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Ekspor Laporan Perkotaan
              </h2>
              <p className="text-xs text-slate-400">Pilih format berkas yang diinginkan</p>
            </div>
          </div>
          <button
            onClick={() => setExportModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Options */}
        <div className="p-5 space-y-3">
          {/* Primary Recommended Option: PDF Document */}
          <button
            onClick={handleExportPDF}
            className="w-full p-4 rounded-2xl border-2 border-blue-500/40 hover:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100/70 dark:hover:bg-blue-900/60 flex items-center space-x-4 transition-all text-left group shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-blue-500/30 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="grow">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-950 dark:text-blue-200 text-sm">
                  Laporan Resmi PDF (.pdf)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white uppercase">
                  Rekomendasi
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                Dokumen resmi cetak berisi tabel ringkasan telemetri, daya, dan status aset kota.
              </p>
            </div>
          </button>

          {/* Secondary Option: CSV Spreadsheet */}
          <button
            onClick={handleExportCSV}
            className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/50 dark:hover:bg-slate-800 flex items-center space-x-3.5 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                Format Lembar Kerja CSV (.csv)
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tabel data dengan pemisah titik koma (;) untuk Microsoft Excel.
              </p>
            </div>
          </button>

          {/* Tertiary Option: JSON Data */}
          <button
            onClick={handleExportJSON}
            className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-slate-800 flex items-center space-x-3.5 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                Format Data JSON (.json)
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Struktur data mentah lengkap untuk integrasi pengembang.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
