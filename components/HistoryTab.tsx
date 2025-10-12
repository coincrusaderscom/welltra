import React from 'react';
import type { WeightEntry } from '../types';
import { Edit, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface HistoryTabProps {
  weightEntries: WeightEntry[];
  onEdit: (entry: WeightEntry) => void;
}

const WeightChangeIndicator: React.FC<{ change: number | null }> = ({ change }) => {
    if (change === null) return null;

    const isLoss = change < 0;
    const isGain = change > 0;
    const changeAbs = Math.abs(change).toFixed(1);

    if (change === 0) {
        return (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Minus size={16} />
                <span>No Change</span>
            </div>
        );
    }
    
    return (
        <div className={`flex items-center gap-1 text-sm ${isLoss ? 'text-green-500' : 'text-red-500'}`}>
            {isLoss ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
            <span>{changeAbs} kg</span>
        </div>
    );
}


const HistoryTab: React.FC<HistoryTabProps> = ({ weightEntries, onEdit }) => {
  if (weightEntries.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">No History Yet</h2>
        <p>Start by logging your weight on the 'Track' tab.</p>
      </div>
    );
  }

  // Display newest entries first
  const sortedEntries = [...weightEntries].reverse();

  return (
    <div className="flex flex-col gap-3">
       <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Your Logbook</h2>
      {sortedEntries.map((entry, index) => {
        const prevEntry = sortedEntries[index + 1];
        const weightChange = prevEntry ? entry.weight - prevEntry.weight : null;

        return (
          <div key={entry.date} className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center w-14">
                    <p className="text-accent-green font-bold text-sm">
                        {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </p>
                    <p className="text-gray-900 dark:text-white font-bold text-2xl">
                         {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric' })}
                    </p>
                </div>
                <div className="border-l border-gray-200 dark:border-gray-700 self-stretch"></div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{entry.weight.toFixed(1)} <span className="text-sm font-medium text-gray-500 dark:text-gray-400">kg</span></p>
                  <WeightChangeIndicator change={weightChange} />
                </div>
            </div>
            <button 
              onClick={() => onEdit(entry)} 
              className="p-3 text-gray-500 dark:text-gray-400 hover:text-accent-green dark:hover:text-accent-green rounded-full hover:bg-gray-100 dark:hover:bg-dark-green transition-colors" 
              aria-label={`Edit entry for ${entry.date}`}
            >
              <Edit size={20} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryTab;
