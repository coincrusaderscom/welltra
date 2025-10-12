import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import type { WeightEntry } from '../types';

interface WeightChartProps {
  data: WeightEntry[];
  theme: 'light' | 'dark';
}
  
const WeightChart: React.FC<WeightChartProps> = ({ data, theme }) => {
  if (data.length < 2) {
    return (
      <div className="bg-white dark:bg-card-dark p-6 rounded-2xl text-center flex items-center justify-center min-h-[300px] shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">
          Log at least two weight entries to see your progress chart.
        </p>
      </div>
    );
  }

  const chartData = [
    {
      id: 'weight',
      data: data.map(entry => ({
        x: entry.date,
        y: entry.weight
      }))
    }
  ];

  const nivoTheme = {
    textColor: theme === 'dark' ? '#A7F3D0' : '#121A16',
    fontSize: 12,
    axis: {
        domain: {
            line: {
                stroke: 'transparent',
            },
        },
        ticks: {
            line: {
                stroke: 'transparent',
            },
            text: {
                fill: theme === 'dark' ? '#9ca3af' : '#6b7280',
            },
        },
        legend: {
            text: {
                fill: theme === 'dark' ? '#9ca3af' : '#6b7280',
            }
        }
    },
    grid: {
        line: {
            stroke: theme === 'dark' ? 'rgba(156, 163, 175, 0.1)' : 'rgba(156, 163, 175, 0.3)',
        },
    },
    tooltip: {
        container: {
            background: theme === 'dark' ? '#1A2420' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#333333',
            border: `1px solid ${theme === 'dark' ? '#34D399' : '#e5e7eb'}`,
        },
    },
  };

  return (
    <div className="bg-white dark:bg-card-dark p-4 pt-8 rounded-2xl shadow-sm h-[300px] md:h-[400px]">
      <ResponsiveLine
        data={chartData}
        theme={nivoTheme}
        colors={['#34D399']}
        margin={{ top: 10, right: 20, bottom: 60, left: 45 }}
        xScale={{ type: 'time', format: '%Y-%m-%d', useUTC: false, precision: 'day' }}
        xFormat="time:%Y-%m-%d"
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
        yFormat=" >-.1f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            format: '%b %d',
            tickValues: 'every 7 days',
            legend: 'Date',
            legendOffset: 45,
            legendPosition: 'middle',
        }}
        axisLeft={{
            legend: 'Weight (kg)',
            legendOffset: -40,
            legendPosition: 'middle',
        }}
        enableGridX={false}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={3}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        enableArea={true}
        areaOpacity={0.1}
      />
    </div>
  );
};

export default WeightChart;