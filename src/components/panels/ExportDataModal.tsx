import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import { FileText, X, Download, FileJson, Table } from 'lucide-react';
import { exportCityDataJSON, exportCityDataCSV } from '../../utils/exportUtils';
import { toast } from 'sonner';

export const ExportDataModal: React.FC = () => {
  const isExportModalOpen = useCityStore((state) => state.isExportModalOpen);
  const setExportModalOpen = useCityStore((state) => state.setExportModalOpen);
  const buildings = useCityStore((state) => state.buildings);

  if (!isExportModalOpen) return null;

  const handleExportJSON = () => {
    toast.info('Export started.', {
      description: 'Generating CityOS Digital Twin JSON report...',
    });
    exportCityDataJSON(buildings);
    setExportModalOpen(false);
  };

  const handleExportCSV = () => {
    toast.info('Export started.', {
      description: 'Generating CityOS CSV spreadsheet...',
    });
    exportCityDataCSV(buildings);
    setExportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-500 text-white">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Export Digital Twin Data
              </h2>
              <p className="text-xs text-slate-400">Select output format</p>
            </div>
          </div>
          <button
            onClick={() => setExportModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Options */}
        <div className="p-6 space-y-3">
          <button
            onClick={handleExportJSON}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/50 dark:hover:bg-slate-800 flex items-center space-x-4 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileJson className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white text-sm">
                JSON Data Format (.json)
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full 3D object telemetry, building load curves, and status attributes.
              </p>
            </div>
          </button>

          <button
            onClick={handleExportCSV}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/50 dark:hover:bg-slate-800 flex items-center space-x-4 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Table className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white text-sm">
                CSV Spreadsheet (.csv)
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Structured tabular format for Excel, Google Sheets, and BI tools.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
