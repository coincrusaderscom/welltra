import React, { useState, useEffect } from 'react';

interface GoalsTabProps {
    goalWeight: number | null;
    setGoalWeight: (goal: number | null) => void;
    startWeight: number | null;
    currentWeight: number | null;
    progressPercentage: number | null;
}

const GoalsTab: React.FC<GoalsTabProps> = ({ goalWeight, setGoalWeight, startWeight, currentWeight, progressPercentage }) => {
    const [inputWeight, setInputWeight] = useState(goalWeight ? String(goalWeight) : '');
    const [error, setError] = useState('');

    useEffect(() => {
        setInputWeight(goalWeight ? String(goalWeight) : '');
    }, [goalWeight]);

    const handleSaveGoal = () => {
        const weightNum = parseFloat(inputWeight);
        if (isNaN(weightNum) || weightNum <= 0) {
            setError('Please enter a valid weight.');
            return;
        }
        setError('');
        setGoalWeight(weightNum);
    };
    
    const handleClearGoal = () => {
        setGoalWeight(null);
        setInputWeight('');
        setError('');
    }

    const weightToGo = goalWeight && currentWeight ? (currentWeight - goalWeight).toFixed(1) : null;
    
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Set Your Goal</h2>
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm mt-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Set a target weight to track your progress.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="number"
                            step="0.1"
                            value={inputWeight}
                            onChange={(e) => setInputWeight(e.target.value)}
                            className="flex-grow w-full px-4 py-3 bg-gray-100 dark:bg-dark-green border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-accent-green focus:border-accent-green transition-shadow"
                            placeholder="e.g., 70.0"
                        />
                        <button 
                            onClick={handleSaveGoal} 
                            className="w-full sm:w-auto bg-accent-green text-dark-green font-bold py-3 px-6 rounded-lg hover:bg-light-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-card-dark focus:ring-accent-green transition-colors"
                        >
                            Save Goal
                        </button>
                    </div>
                     {goalWeight && (
                         <button 
                            onClick={handleClearGoal} 
                            className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 mt-4"
                        >
                           Clear Goal
                        </button>
                    )}
                    {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>}
                </div>
            </div>

            {goalWeight && startWeight && currentWeight && (
                 <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Your Progress</h2>
                    <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm mt-4">
                        <div className="mb-6">
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="text-2xl font-bold text-accent-green">{progressPercentage}%</span>
                                <span className="text-base font-medium text-gray-600 dark:text-gray-400">
                                    {weightToGo !== null && `${Math.abs(Number(weightToGo))}kg ${Number(weightToGo) > 0 ? 'to go' : 'surpassed'}`}
                                </span>
                            </div>
                            <div 
                                className="w-full bg-gray-200 dark:bg-dark-green rounded-full h-4 shadow-inner"
                                role="progressbar"
                                aria-valuenow={progressPercentage ?? 0}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label="Goal progress"
                            >
                                <div 
                                    className="bg-gradient-to-r from-accent-green to-light-green h-4 rounded-full transition-all duration-500 ease-out" 
                                    style={{width: `${Math.min(progressPercentage ?? 0, 100)}%`}}
                                ></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 text-center mt-6 divide-x divide-gray-200 dark:divide-gray-700">
                           <div className="px-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Start</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{startWeight.toFixed(1)} kg</p>
                           </div>
                           <div className="px-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Current</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{currentWeight.toFixed(1)} kg</p>
                           </div>
                           <div className="px-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Goal</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{goalWeight.toFixed(1)} kg</p>
                           </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoalsTab;