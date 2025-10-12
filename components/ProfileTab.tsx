import React, { useState, useMemo } from 'react';
import type { WeightEntry } from '../types';
import { Ruler, Edit, TrendingUp, TrendingDown, ChevronsRight, Download, Trash2, X } from 'lucide-react';

interface ProfileTabProps {
    height: number | null;
    setHeight: (height: number | null) => void;
    weightEntries: WeightEntry[];
    clearAllData: () => void;
}

const StatItem: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-3">
            {icon}
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
        </div>
        <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
);

const ProfileTab: React.FC<ProfileTabProps> = ({ height, setHeight, weightEntries, clearAllData }) => {
    const [isHeightModalOpen, setIsHeightModalOpen] = useState(false);
    const [newHeight, setNewHeight] = useState(height ? String(height) : '');
    const [error, setError] = useState('');

    const stats = useMemo(() => {
        if (weightEntries.length === 0) {
            return {
                startWeight: null,
                highestWeight: null,
                lowestWeight: null,
                totalChange: null,
            };
        }

        const weights = weightEntries.map(e => e.weight);
        const startWeight = weightEntries[0].weight;
        const currentWeight = weightEntries[weightEntries.length - 1].weight;
        const highestWeight = Math.max(...weights);
        const lowestWeight = Math.min(...weights);
        const totalChange = currentWeight - startWeight;

        return { startWeight, highestWeight, lowestWeight, totalChange };
    }, [weightEntries]);

    const handleHeightSave = () => {
        const heightNum = parseInt(newHeight, 10);
        if (isNaN(heightNum) || heightNum <= 50 || heightNum > 250) {
          setError('Please enter a valid height in centimeters (e.g., 175).');
          return;
        }
        setError('');
        setHeight(heightNum);
        setIsHeightModalOpen(false);
    };
    
    const handleExportData = () => {
        if (weightEntries.length === 0) {
            alert('No data to export.');
            return;
        }

        const headers = 'date,weight_kg';
        const csvContent = weightEntries.map(e => `${e.date},${e.weight}`).join('\n');
        const blob = new Blob([headers + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'weight_tracker_export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
    const handleClearData = () => {
        if (window.confirm('Are you sure you want to delete ALL your data? This includes your height, goal, and all weight entries. This action cannot be undone.')) {
            clearAllData();
        }
    };

    return (
        <div className="flex flex-col gap-8">
            {/* User Details */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">User Details</h2>
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Ruler size={24} className="text-accent-green" />
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Height</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{height} cm</p>
                        </div>
                    </div>
                    <button onClick={() => setIsHeightModalOpen(true)} className="p-3 text-gray-500 dark:text-gray-400 hover:text-accent-green dark:hover:text-accent-green rounded-full hover:bg-gray-100 dark:hover:bg-dark-green transition-colors" aria-label="Edit height">
                        <Edit size={20} />
                    </button>
                </div>
            </div>

            {/* Statistics */}
            {stats.startWeight !== null && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Statistics</h2>
                    <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm mt-4 divide-y divide-gray-200 dark:divide-gray-700">
                        <StatItem label="Starting Weight" value={`${stats.startWeight.toFixed(1)} kg`} icon={<ChevronsRight size={20} className="text-gray-400" />} />
                        <StatItem label="Highest Weight" value={`${stats.highestWeight.toFixed(1)} kg`} icon={<TrendingUp size={20} className="text-red-500" />} />
                        <StatItem label="Lowest Weight" value={`${stats.lowestWeight.toFixed(1)} kg`} icon={<TrendingDown size={20} className="text-green-500" />} />
                        <StatItem label="Total Change" value={`${stats.totalChange.toFixed(1)} kg`} icon={stats.totalChange >= 0 ? <TrendingUp size={20} className="text-red-500" /> : <TrendingDown size={20} className="text-green-500" />} />
                    </div>
                </div>
            )}
            
            {/* Data Management */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Data Management</h2>
                 <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm mt-4 flex flex-col gap-4">
                     <button onClick={handleExportData} className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-dark-green font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-card-dark focus:ring-gray-500 transition-colors">
                        <Download size={20} />
                        Export Data as CSV
                    </button>
                    <button onClick={handleClearData} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 dark:bg-red-500/10 dark:text-red-400 font-bold py-3 px-4 rounded-lg hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-card-dark focus:ring-red-500 transition-colors">
                        <Trash2 size={20} />
                        Clear All Data
                    </button>
                </div>
            </div>
            
            {/* Height Edit Modal */}
            {isHeightModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={() => setIsHeightModalOpen(false)}>
                    <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-lg w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Height</h2>
                             <button onClick={() => setIsHeightModalOpen(false)} className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-dark-green transition-colors" aria-label="Close modal">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="height-edit" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Height (cm)
                                </label>
                                <input
                                type="number"
                                id="height-edit"
                                value={newHeight}
                                onChange={(e) => setNewHeight(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-green border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-accent-green focus:border-accent-green transition-shadow"
                                placeholder="e.g., 175"
                                autoFocus
                                />
                                {error && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>}
                            </div>
                            <button onClick={handleHeightSave} className="w-full bg-accent-green text-dark-green font-bold py-3 px-4 rounded-lg hover:bg-light-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-card-dark focus:ring-accent-green transition-colors mt-2">
                                Save Height
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileTab;