import React, { useState, useEffect, useMemo } from 'react';
import type { MeasurementEntry } from '../types';
import { Trash2 } from 'lucide-react';
import DatePicker from './DatePicker';

interface MeasurementInputFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entryData: Omit<MeasurementEntry, 'date'>, date: string, originalDate?: string) => void;
  onDelete: (date: string) => void;
  entryToEdit: MeasurementEntry | null;
}

const MeasurementInputForm: React.FC<MeasurementInputFormProps> = ({ isOpen, onClose, onSave, onDelete, entryToEdit }) => {
  const [date, setDate] = useState('');
  const [originalDate, setOriginalDate] = useState<string | undefined>(undefined);
  const [waist, setWaist] = useState('');
  const [arm, setArm] = useState('');
  const [thigh, setThigh] = useState('');
  const [error, setError] = useState('');

  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    if (isOpen) {
      if (entryToEdit) {
        setDate(entryToEdit.date);
        setOriginalDate(entryToEdit.date);
        setWaist(entryToEdit.waist?.toString() ?? '');
        setArm(entryToEdit.arm?.toString() ?? '');
        setThigh(entryToEdit.thigh?.toString() ?? '');
      } else {
        setDate(todayISO);
        setOriginalDate(undefined);
        setWaist('');
        setArm('');
        setThigh('');
      }
      setError('');
    }
  }, [isOpen, entryToEdit, todayISO]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waistNum = waist ? parseFloat(waist) : undefined;
    const armNum = arm ? parseFloat(arm) : undefined;
    const thighNum = thigh ? parseFloat(thigh) : undefined;

    if (!waist && !arm && !thigh) {
        setError('Please enter at least one measurement.');
        return;
    }
    
    if ((waist && (isNaN(waistNum) || waistNum <= 0)) || (arm && (isNaN(armNum) || armNum <= 0)) || (thigh && (isNaN(thighNum) || thighNum <= 0))) {
        setError('Please enter valid, positive numbers for measurements.');
        return;
    }

    setError('');
    onSave({ waist: waistNum, arm: armNum, thigh: thighNum }, date, originalDate);
  };
  
  const handleDelete = () => {
    if (originalDate) {
        onDelete(originalDate);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-lg w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{entryToEdit ? 'Edit Measurements' : 'Log Measurements'}</h2>
            {entryToEdit && (
                <button onClick={handleDelete} className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors" aria-label="Delete entry">
                    <Trash2 size={20} />
                </button>
            )}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="measurement-date" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Date</label>
            <DatePicker
                value={date}
                onChange={setDate}
                maxDate={todayISO}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="waist" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Waist (cm)</label>
              <input type="number" id="waist" step="0.1" value={waist} onChange={(e) => setWaist(e.target.value)} className="w-full px-2 py-3 bg-gray-100 dark:bg-dark-green border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-accent-green focus:border-accent-green transition-shadow" placeholder="e.g., 80.5" />
            </div>
            <div>
              <label htmlFor="arm" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Arm (cm)</label>
              <input type="number" id="arm" step="0.1" value={arm} onChange={(e) => setArm(e.target.value)} className="w-full px-2 py-3 bg-gray-100 dark:bg-dark-green border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-accent-green focus:border-accent-green transition-shadow" placeholder="e.g., 35.0" />
            </div>
            <div>
              <label htmlFor="thigh" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Thigh (cm)</label>
              <input type="number" id="thigh" step="0.1" value={thigh} onChange={(e) => setThigh(e.target.value)} className="w-full px-2 py-3 bg-gray-100 dark:bg-dark-green border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-accent-green focus:border-accent-green transition-shadow" placeholder="e.g., 60.2" />
            </div>
          </div>
          
          {error && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>}
          
          <button type="submit" className="w-full bg-accent-green text-dark-green font-bold py-3 px-4 rounded-lg hover:bg-light-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-card-dark focus:ring-accent-green transition-colors mt-2">
            {entryToEdit ? 'Update Entry' : 'Save Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MeasurementInputForm;