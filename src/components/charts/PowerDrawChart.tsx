import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

interface PowerDrawChartProps {
  data: number[];
  isNightMode?: boolean;
}

export const PowerDrawChart: React.FC<PowerDrawChartProps> = ({ data, isNightMode = false }) => {
  const option = {
    grid: {
      left: '3%',
      right: '3%',
      top: '10%',
      bottom: '5%',
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      show: false,
      boundaryGap: false,
      data: data.map((_, i) => `${i}:00`),
    },
    yAxis: {
      type: 'value',
      show: false,
      min: Math.min(...data) * 0.8,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      extraCssText: 'z-index: 50; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15);',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#3B82F6',
      borderWidth: 1,
      textStyle: {
        color: '#0F172A',
        fontSize: 12,
        fontFamily: 'Inter, sans-serif',
      },
      formatter: (params: any) => {
        const item = params[0];
        return `<div class="font-sans">
          <div class="text-[11px] text-slate-400">Waktu: ${item.name}</div>
          <div class="font-semibold text-blue-500">${item.value} kW</div>
        </div>`;
      },
    },
    series: [
      {
        data: data,
        type: 'line',
        smooth: 0.45,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        itemStyle: {
          color: '#3B82F6',
          borderColor: '#FFFFFF',
          borderWidth: 2,
        },
        lineStyle: {
          width: 3,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#60A5FA' },
            { offset: 0.5, color: '#3B82F6' },
            { offset: 1, color: '#00D8FF' },
          ]),
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.35)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.01)' },
          ]),
        },
        markPoint: {
          symbol: 'circle',
          symbolSize: 10,
          data: [{ type: 'max', name: 'Beban Puncak' }],
          itemStyle: {
            color: '#00D8FF',
            borderColor: '#FFFFFF',
            borderWidth: 2,
          },
          label: {
            show: false,
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '140px', width: '100%' }} notMerge={true} lazyUpdate={true} />;
};
