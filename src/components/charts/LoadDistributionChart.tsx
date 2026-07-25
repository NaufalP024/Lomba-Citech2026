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
      backgroundColor: isNightMode ? '#1E293B' : 'rgba(255, 255, 255, 0.95)',
      textStyle: {
        color: isNightMode ? '#F8FAFC' : '#0F172A',
        fontFamily: 'Poppins',
        fontSize: 12,
      },
      formatter: '{b}: {c}%',
    },
    series: [
      {
        name: 'Load Distribution',
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
          { value: distribution.lighting, name: 'Lighting', itemStyle: { color: '#3B82F6' } },
          { value: distribution.hvac, name: 'HVAC (climate)', itemStyle: { color: '#60A5FA' } },
          { value: distribution.misc, name: 'Misc', itemStyle: { color: '#93C5FD' } },
          { value: distribution.itServers, name: 'IT & servers', itemStyle: { color: '#1D4ED8' } },
        ],
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '110px', width: '110px' }} notMerge={true} lazyUpdate={true} />;
};
