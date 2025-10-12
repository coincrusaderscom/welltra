import React, { useState } from 'react';

interface HeightModalProps {
  onHeightSubmit: (height: number) => void;
}

const HeightModal: React.FC<HeightModalProps> = ({ onHeightSubmit }) => {
  const [height, setHeight] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const heightNum = parseInt(height, 10);
    if (isNaN(heightNum) || heightNum <= 50 || heightNum > 250) {
      setError('Please enter a valid height in centimeters (e.g., 175).');
      return;
    }
    setError('');
    onHeightSubmit(heightNum);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-card-dark p-8 rounded-2xl shadow-2xl w-full max-w-md m-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">To get started and calculate your BMI, please enter your height.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-green border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-accent-green focus:border-accent-green transition-shadow"
              placeholder="e.g., 175"
              autoFocus
            />
            {error && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>}
          </div>
          <button 
            type="submit" 
            className="w-full bg-accent-green text-dark-green font-bold py-3 px-4 rounded-lg hover:bg-light-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-card-dark focus:ring-accent-green transition-colors"
          >
            Start Tracking
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeightModal;