import React, { useState, useMemo, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { WeightEntry, MeasurementEntry } from './types';
import Header from './components/Header';
import WeightInputForm from './components/WeightInputForm';
import MeasurementInputForm from './components/MeasurementInputForm';
import Dashboard from './components/Dashboard';
import WeightChart from './components/WeightChart';
import MotivationCard from './components/MotivationCard';
import HeightModal from './components/HeightModal';
import BottomNav from './components/GoalSetter'; // This file is the Bottom Nav
import GoalsTab from './components/GoalsTab';
import HistoryTab from './components/HistoryTab';
import MeasurementsTab from './components/MeasurementsTab';
import ProfileTab from './components/ProfileTab';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [height, setHeight] = useLocalStorage<number | null>('userHeight', null);
  const [weightEntries, setWeightEntries] = useLocalStorage<WeightEntry[]>('weightEntries', []);
  const [measurementEntries, setMeasurementEntries] = useLocalStorage<MeasurementEntry[]>('measurementEntries', []);
  const [goalWeight, setGoalWeight] = useLocalStorage<number | null>('goalWeight', null);

  // State for Weight Modal
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<WeightEntry | null>(null);
  
  // State for Measurements Modal
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [measurementEntryToEdit, setMeasurementEntryToEdit] = useState<MeasurementEntry | null>(null);

  const [activeTab, setActiveTab] = useState('Track');
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');

  // --- Weight Entry Logic ---
  const saveWeightEntry = useCallback((weight: number, date: string, originalDate?: string) => {
    const newEntry: WeightEntry = { date, weight };
    let entries = [...weightEntries];

    if (originalDate && originalDate !== date) {
      entries = entries.filter(entry => entry.date !== originalDate);
    }
    
    const existingEntryIndex = entries.findIndex(entry => entry.date === date);

    if (existingEntryIndex !== -1) {
      entries[existingEntryIndex] = newEntry;
    } else {
      entries.push(newEntry);
    }

    setWeightEntries(entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setIsWeightModalOpen(false);
    setEntryToEdit(null);
  }, [weightEntries, setWeightEntries]);
  
  const deleteWeightEntry = useCallback((date: string) => {
    if (window.confirm('Are you sure you want to delete this weight entry?')) {
        setWeightEntries(weightEntries.filter(entry => entry.date !== date));
        setIsWeightModalOpen(false);
        setEntryToEdit(null);
    }
  }, [weightEntries, setWeightEntries]);

  // --- Measurement Entry Logic ---
  const saveMeasurementEntry = useCallback((entryData: Omit<MeasurementEntry, 'date'>, date: string, originalDate?: string) => {
      const newEntry: MeasurementEntry = { date, ...entryData };
      let entries = [...measurementEntries];

      if (originalDate && originalDate !== date) {
          entries = entries.filter(e => e.date !== originalDate);
      }

      const existingIndex = entries.findIndex(e => e.date === date);

      if (existingIndex > -1) {
          entries[existingIndex] = newEntry;
      } else {
          entries.push(newEntry);
      }

      setMeasurementEntries(entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setIsMeasurementModalOpen(false);
      setMeasurementEntryToEdit(null);
  }, [measurementEntries, setMeasurementEntries]);

  const deleteMeasurementEntry = useCallback((date: string) => {
      if (window.confirm('Are you sure you want to delete this measurement entry?')) {
          setMeasurementEntries(measurementEntries.filter(entry => entry.date !== date));
          setIsMeasurementModalOpen(false);
          setMeasurementEntryToEdit(null);
      }
  }, [measurementEntries, setMeasurementEntries]);
  
  // --- Modal Handlers ---
  const handleOpenAddWeightModal = () => {
    setEntryToEdit(null);
    setIsWeightModalOpen(true);
  };
  
  const handleOpenEditWeightModal = (entry: WeightEntry) => {
    setEntryToEdit(entry);
    setIsWeightModalOpen(true);
  };
  
  const handleOpenAddMeasurementModal = () => {
    setMeasurementEntryToEdit(null);
    setIsMeasurementModalOpen(true);
  };

  const handleOpenEditMeasurementModal = (entry: MeasurementEntry) => {
      setMeasurementEntryToEdit(entry);
      setIsMeasurementModalOpen(true);
  };

  const handleAddClick = () => {
    if (activeTab === 'Track') {
      handleOpenAddWeightModal();
    } else if (activeTab === 'Measurements') {
      handleOpenAddMeasurementModal();
    }
  };

  const clearAllData = useCallback(() => {
    setWeightEntries([]);
    setMeasurementEntries([]);
    setGoalWeight(null);
    setHeight(null);
  }, [setWeightEntries, setMeasurementEntries, setGoalWeight, setHeight]);

  // --- Memos for derived state ---
  const firstWeightEntry = useMemo(() => {
    return weightEntries.length > 0 ? weightEntries[0] : null;
  }, [weightEntries]);

  const latestWeightEntry = useMemo(() => {
    return weightEntries.length > 0 ? weightEntries[weightEntries.length - 1] : null;
  }, [weightEntries]);

  const bmi = useMemo(() => {
    if (latestWeightEntry && height) {
      const heightInMeters = height / 100;
      return parseFloat((latestWeightEntry.weight / (heightInMeters * heightInMeters)).toFixed(1));
    }
    return null;
  }, [latestWeightEntry, height]);

  const goalProgress = useMemo(() => {
    if (!goalWeight || !firstWeightEntry || !latestWeightEntry) {
      return { weightToGo: null, progressPercentage: null };
    }
    const startWeight = firstWeightEntry.weight;
    const currentWeight = latestWeightEntry.weight;
    const weightToGo = parseFloat((currentWeight - goalWeight).toFixed(1));
    const totalToChange = startWeight - goalWeight;
    if (totalToChange === 0) {
        return { weightToGo, progressPercentage: currentWeight === goalWeight ? 100 : 0 };
    }
    const weightChanged = startWeight - currentWeight;
    const progressPercentage = Math.max(0, Math.round((weightChanged / totalToChange) * 100));
    return { weightToGo, progressPercentage };
  }, [goalWeight, firstWeightEntry, latestWeightEntry]);
  
  if (!height) {
    return <HeightModal onHeightSubmit={setHeight} />;
  }

  return (
    <div className="bg-cream dark:bg-dark-green min-h-screen font-sans text-gray-900 dark:text-gray-100 pb-24 font-sans transition-colors duration-300">
      <Header 
        title={activeTab}
        onAddClick={handleAddClick} 
        theme={theme} 
        setTheme={setTheme} 
        showAddButton={['Track', 'Measurements'].includes(activeTab)}
      />
      <main className="container mx-auto p-4 md:p-6">
        {activeTab === 'Track' && (
            <div className="flex flex-col gap-6">
              <MotivationCard />
                <Dashboard 
                    latestWeight={latestWeightEntry?.weight ?? null}
                    bmi={bmi}
                    goalWeight={goalWeight}
                    weightToGo={goalProgress.weightToGo}
                />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-4">Weight Progress</h2>
                <WeightChart data={weightEntries} theme={theme} />
                
                
            </div>
        )}
        {activeTab === 'History' && (
            <HistoryTab 
                weightEntries={weightEntries}
                onEdit={handleOpenEditWeightModal}
            />
        )}
        {activeTab === 'Measurements' && (
            <MeasurementsTab
                measurementEntries={measurementEntries}
                onEdit={handleOpenEditMeasurementModal}
                theme={theme}
            />
        )}
        {activeTab === 'Goals' && (
            <GoalsTab 
                goalWeight={goalWeight} 
                setGoalWeight={setGoalWeight} 
                startWeight={firstWeightEntry?.weight ?? null}
                currentWeight={latestWeightEntry?.weight ?? null}
                progressPercentage={goalProgress.progressPercentage}
            />
        )}
        {activeTab === 'Profile' && (
            <ProfileTab
                height={height}
                setHeight={setHeight}
                weightEntries={weightEntries}
                clearAllData={clearAllData}
            />
        )}
      </main>
      <WeightInputForm 
        isOpen={isWeightModalOpen} 
        onClose={() => setIsWeightModalOpen(false)} 
        onSaveWeight={saveWeightEntry}
        onDeleteWeight={deleteWeightEntry}
        weightEntries={weightEntries}
        entryToEdit={entryToEdit}
      />
      <MeasurementInputForm
        isOpen={isMeasurementModalOpen}
        onClose={() => setIsMeasurementModalOpen(false)}
        onSave={saveMeasurementEntry}
        onDelete={deleteMeasurementEntry}
        entryToEdit={measurementEntryToEdit}
      />
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
