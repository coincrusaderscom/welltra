import React, { useMemo } from 'react';
import type { MeasurementEntry } from '../types';
import { Edit } from 'lucide-react';
import { ResponsiveLine } from '@nivo/line';

interface MeasurementsTabProps {
  measurementEntries: MeasurementEntry[];
  onEdit: (entry: MeasurementEntry) => void;
  theme: 'light' | 'dark';
}

const MeasurementChart: React.FC<{ data: any[], theme: string, title: string }> = ({ data, theme, title }) => {
    if (data[0].data.length < 2) return null;
    
    const nivoTheme = {
        textColor: theme === 'dark' ? '#A7F3D0' : '#121A16',
        fontSize: 12,
        axis: { ticks: { text: { fill: theme === 'dark' ? '#9ca3af' : '#6b7280' } }, legend: { text: { fill: theme === 'dark' ? '#9ca3af' : '#6b7280' } } },
        grid: { line: { stroke: theme === 'dark' ? 'rgba(156, 163, 175, 0.1)' : 'rgba(156, 163, 175, 0.3)' } },
        tooltip: { container: { background: theme === 'dark' ? '#1A2420' : '#ffffff', color: theme === 'dark' ? '#ffffff' : '#333333', border: `1px solid ${theme === 'dark' ? '#34D399' : '#e5e7eb'}` } },
    };

    return (
        <div className="bg-white dark:bg-card-dark p-4 pt-8 rounded-2xl shadow-sm h-[250px] md:h-[300px]">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight -mt-6 mb-2 ml-2">{title} Progress</h3>
            <ResponsiveLine
                data={data} theme={nivoTheme} colors={['#34D399']}
                margin={{ top: 10, right: 20, bottom: 60, left: 45 }}
                xScale={{ type: 'time', format: '%Y-%m-%d', useUTC: false, precision: 'day' }}
                xFormat="time:%Y-%m-%d"
                yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                yFormat=" >-.1f"
                axisBottom={{ format: '%b %d', tickValues: 'every 14 days', legend: 'Date', legendOffset: 45, legendPosition: 'middle' }}
                axisLeft={{ legend: 'cm', legendOffset: -40, legendPosition: 'middle' }}
                enableGridX={false} pointSize={8} pointBorderWidth={3} pointBorderColor={{ from: 'serieColor' }} useMesh={true} enableArea={true} areaOpacity={0.1}
            />
        </div>
    );
};

const MeasurementsTab: React.FC<MeasurementsTabProps> = ({ measurementEntries, onEdit, theme }) => {
  const sortedEntries = useMemo(() => [...measurementEntries].reverse(), [measurementEntries]);

  const { waistData, armData, thighData } = useMemo(() => {
    const waist = [{ id: 'waist', data: measurementEntries.filter(e => e.waist).map(e => ({ x: e.date, y: e.waist })) }];
    const arm = [{ id: 'arm', data: measurementEntries.filter(e => e.arm).map(e => ({ x: e.date, y: e.arm })) }];
    const thigh = [{ id: 'thigh', data: measurementEntries.filter(e => e.thigh).map(e => ({ x: e.date, y: e.thigh })) }];
    return { waistData: waist, armData: arm, thighData: thigh };
  }, [measurementEntries]);

  if (measurementEntries.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">No Measurements Yet</h2>
        <p>Tap the "+" button to log your first measurement.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">Measurement History</h2>
        <div className="flex flex-col gap-3">
            {sortedEntries.map((entry) => (
            <div key={entry.date} className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                     <div className="flex flex-col items-center justify-center w-14">
                        <p className="text-accent-green font-bold text-sm">{new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</p>
                        <p className="text-gray-900 dark:text-white font-bold text-2xl">{new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric' })}</p>
                    </div>
                    <div className="border-l border-gray-200 dark:border-gray-700 self-stretch"></div>
                    <div className="grid grid-cols-3 gap-x-4 text-center">
                        {entry.waist && <div><p className="text-sm text-gray-500 dark:text-gray-400">Waist</p><p className="font-semibold text-gray-900 dark:text-white">{entry.waist.toFixed(1)} cm</p></div>}
                        {entry.arm && <div><p className="text-sm text-gray-500 dark:text-gray-400">Arm</p><p className="font-semibold text-gray-900 dark:text-white">{entry.arm.toFixed(1)} cm</p></div>}
                        {entry.thigh && <div><p className="text-sm text-gray-500 dark:text-gray-400">Thigh</p><p className="font-semibold text-gray-900 dark:text-white">{entry.thigh.toFixed(1)} cm</p></div>}
                    </div>
                </div>
                <button onClick={() => onEdit(entry)} className="p-3 text-gray-500 dark:text-gray-400 hover:text-accent-green dark:hover:text-accent-green rounded-full hover:bg-gray-100 dark:hover:bg-dark-green transition-colors" aria-label={`Edit entry for ${entry.date}`}>
                <Edit size={20} />
                </button>
            </div>
            ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-4 mb-4">Progress Charts</h2>
         <div className="flex flex-col gap-4">
            <MeasurementChart data={waistData} theme={theme} title="Waist" />
            <MeasurementChart data={armData} theme={theme} title="Arm" />
            <MeasurementChart data={thighData} theme={theme} title="Thigh" />
         </div>
      </div>
    </div>
  );
};

export default MeasurementsTab;
