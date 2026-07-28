import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import ReactECharts from 'echarts-for-react';
import analyticsData from '../../data/analytics.json';
import { Zap, Activity, ShieldCheck, Droplet } from 'lucide-react';

export const AnalyticsViewModal: React.FC = () => {
  const activeTab = useCityStore((state) => state.activeTab);
  const isNightMode = useCityStore((state) => state.isNightMode);

  if (activeTab !== 'Analytics') return null;

  const chartOption = {
    tooltip: { trigger: 'axis', confine: true },
    legend: { data: ['Beban Jaringan Listrik (MW)', 'Pasokan Energi Surya (MW)'], textStyle: { color: isNightMode ? '#FFF' : '#333' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: analyticsData.hourlyGridPower.map((d) => d.time) },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Beban Jaringan Listrik (MW)',
        type: 'bar',
        data: analyticsData.hourlyGridPower.map((d) => d.usage),
        itemStyle: { color: '#3B82F6', borderRadius: [4, 4, 0, 0] },
      },
      {
        name: 'Pasokan Energi Surya (MW)',
        type: 'line',
        smooth: true,
        data: analyticsData.hourlyGridPower.map((d) => d.renewable),
        itemStyle: { color: '#34D399' },
        lineStyle: { width: 3 },
      },
    ],
  };

  return (
    <div className="fixed top-16 sm:top-20 left-3 sm:left-6 right-3 lg:right-[410px] bottom-3 sm:bottom-6 z-30 bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Analisis Energi & Sumber Daya Kota
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Statistik terpadu pasokan listrik, penggunaan air, dan efisiensi kota.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards (Responsive grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-blue-500/10 border border-blue-500/20 p-3.5 sm:p-4 rounded-2xl">
          <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1 flex items-center space-x-1.5">
            <Zap className="w-4 h-4 shrink-0" />
            <span>Konsumsi Daya Total</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {analyticsData.cityOverview.totalPowerConsumption}
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 sm:p-4 rounded-2xl">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Efisiensi Jaringan</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {analyticsData.cityOverview.gridEfficiency}
          </div>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/20 p-3.5 sm:p-4 rounded-2xl">
          <div className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold mb-1 flex items-center space-x-1.5">
            <Droplet className="w-4 h-4 shrink-0" />
            <span>Rata-rata Tekanan Air</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {analyticsData.cityOverview.avgWaterPressure}
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 p-3.5 sm:p-4 rounded-2xl">
          <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1 flex items-center space-x-1.5">
            <Activity className="w-4 h-4 shrink-0" />
            <span>Rata-rata Okupansi Kota</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {analyticsData.cityOverview.totalOccupancy}
          </div>
        </div>
      </div>

      {/* Hourly Grid Chart */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm mb-3 sm:mb-4">
          Grafik 24 Jam: Beban Listrik vs Daya Surya
        </h3>
        <ReactECharts option={chartOption} style={{ height: '260px', width: '100%' }} />
      </div>
    </div>
  );
};
