import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import { Download, X, FileText } from 'lucide-react';
import { exportCityDataPDF } from '../../utils/exportUtils';
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
              <p className="text-xs text-slate-400">Unduh dokumen resmi digital twin</p>
            </div>
          </div>
          <button
            onClick={() => setExportModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Option (PDF Exclusive) */}
        <div className="p-6">
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
                  PDF Resmi
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                Dokumen cetak cetakan resmi berisi tabel ringkasan telemetri, konsumsi daya, dan status aset kota.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
