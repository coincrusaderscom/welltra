import React, { useState, useEffect, useMemo } from 'react';
import type { WeightEntry } from '../types';
import { Trash2 } from 'lucide-react';
import DatePicker from './DatePicker';

interface WeightInputFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveWeight: (weight: number, date: string, originalDate?: string) => void;
  onDeleteWeight: (date: string) => void;
  weightEntries: WeightEntry[];
  entryToEdit: WeightEntry | null;
}

const WeightInputForm: React.FC<WeightInputFormProps> = ({ isOpen, onClose, onSaveWeight, onDeleteWeight, weightEntries, entryToEdit }) => {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [originalDate, setOriginalDate] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');

  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    if (isOpen) {
      if (entryToEdit) {
        setWeight(String(entryToEdit.weight));
        setDate(entryToEdit.date);
        setOriginalDate(entryToEdit.date);
      } else {
        setDate(todayISO);
        setOriginalDate(undefined);
        setWeight('');
      }
      setError('');
    }
  }, [isOpen, entryToEdit, todayISO]);
  
  useEffect(() => {
    // This effect pre-fills weight if user changes date to one that already has an entry.
    // It should not run when editing, as the initial weight is set by the effect above.
    if (date && isOpen && !entryToEdit) {
      const entryForDate = weightEntries.find(entry => entry.date === date);
      setWeight(entryForDate ? String(entryForDate.weight) : '');
      setError('');
    }
  }, [date, weightEntries, isOpen, entryToEdit]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setError('Please enter a valid weight.');
      return;
    }
    setError('');
    
    if (entryToEdit) {
        if (window.confirm('Are you sure you want to update this entry?')) {
            onSaveWeight(weightNum, date, originalDate);
        }
    } else {
        onSaveWeight(weightNum, date, originalDate);
    }
  };
  
  const handleDelete = () => {
    if (originalDate) {
        onDeleteWeight(originalDate);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-lg w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{entryToEdit ? 'Edit Entry' : 'Log Weight'}</h2>
            {entryToEdit && (
                <button 
                    onClick={handleDelete}
                    className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    aria-label="Delete entry"
                >
                    <Trash2 size={20} />
                </button>
            )}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Date
            </label>
            <DatePicker 
              value={date}
              onChange={setDate}
              maxDate={todayISO}
            />
          </div>
          <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Weight (kg)
              </label>
              <div className="relative">
                  <input
                      type="number"
                      id="weight"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-green border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-accent-green focus:border-accent-green transition-shadow"
                      placeholder="e.g., 75.5"
                      autoFocus
                  />
              </div>
              {error && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>}
          </div>
          <button 
              type="submit" 
              className="w-full bg-accent-green text-dark-green font-bold py-3 px-4 rounded-lg hover:bg-light-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-card-dark focus:ring-accent-green transition-colors mt-2"
          >
            {entryToEdit ? 'Update Weight' : 'Save Weight'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WeightInputForm;