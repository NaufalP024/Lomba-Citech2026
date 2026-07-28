import React from 'react';
import ReactECharts from 'echarts-for-react';
import { LoadDistribution } from '../../types/city';

interface LoadDistributionChartProps {
  distribution: LoadDistribution;
  isNightMode?: boolean;
}

export const LoadDistributionChart: React.FC<LoadDistributionChartProps> = ({ distribution, isNightMode = false }) => {
  const option = {
    tooltip: {
      trigger: 'item',
      confine: true,
      extraCssText: 'z-index: 50; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15);',
      backgroundColor: isNightMode ? '#0F172A' : 'rgba(255, 255, 255, 0.98)',
      borderColor: isNightMode ? '#334155' : '#E2E8F0',
      borderWidth: 1,
      padding: [6, 10],
      textStyle: {
        color: isNightMode ? '#F8FAFC' : '#0F172A',
        fontFamily: 'Inter, sans-serif',
        fontSize: 11,
        fontWeight: 500,
      },
      formatter: '{b}: <b>{c}%</b>',
    },
    series: [
      {
        name: 'Distribusi Beban',
        type: 'pie',
        radius: ['55%', '85%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: isNightMode ? '#1E293B' : '#FFFFFF',
          borderWidth: 3,
        },
        label: {
          show: false,
        },
        data: [
          { value: distribution.lighting, name: 'Pencahayaan', itemStyle: { color: '#3B82F6' } },
          { value: distribution.hvac, name: 'Pendingin Udara', itemStyle: { color: '#60A5FA' } },
          { value: distribution.misc, name: 'Peralatan Utilitas', itemStyle: { color: '#93C5FD' } },
          { value: distribution.itServers, name: 'Server & Perangkat IT', itemStyle: { color: '#1D4ED8' } },
        ],
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '110px', width: '110px' }} notMerge={true} lazyUpdate={true} />;
};
