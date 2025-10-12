import React from 'react';
import { Scale, Gauge, Trophy } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, unit }) => (
  <div className="bg-white dark:bg-card-dark p-4 rounded-2xl flex items-center gap-4 shadow-sm">
    <div className="bg-gray-100 dark:bg-dark-green p-3 rounded-xl">
        {icon}
    </div>
    <div>
      <h3 className="text-base font-medium text-gray-600 dark:text-gray-400">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value} {unit && <span className="text-base font-medium text-gray-500 dark:text-gray-400">{unit}</span>}
      </p>
    </div>
  </div>
);

interface DashboardProps {
  latestWeight: number | null;
  bmi: number | null;
  goalWeight: number | null;
  weightToGo: number | null;
}

const Dashboard: React.FC<DashboardProps> = ({ latestWeight, bmi, goalWeight, weightToGo }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard 
        icon={<Scale size={32} className="text-accent-green" />}
        title="Current Weight"
        value={latestWeight?.toFixed(1) ?? '--'}
        unit="kg"
      />
      <StatCard 
        icon={<Gauge size={32} className="text-accent-green" />}
        title="Current BMI"
        value={bmi?.toFixed(1) ?? '--'}
      />
      {goalWeight !== null && weightToGo !== null && (
         <StatCard 
            icon={<Trophy size={32} className="text-accent-green" />}
            title={weightToGo > 0 ? "Kilograms to Go" : "Goal Surpassed By"}
            value={Math.abs(weightToGo).toFixed(1)}
            unit="kg"
        />
      )}
    </div>
  );
};

export default Dashboard;