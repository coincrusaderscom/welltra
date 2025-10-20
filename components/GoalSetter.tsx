import React from 'react';
// FIX: The `TapeMeasure` icon does not exist in `lucide-react`. Replaced with `Ruler`.
import { LineChart, History, Trophy, User, Ruler } from 'lucide-react';

const navItems = [
    { name: 'Track', icon: LineChart },
    { name: 'History', icon: History },
    { name: 'Measurements', icon: Ruler },
    { name: 'Goals', icon: Trophy },
    { name: 'Profile', icon: User },
];

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    return (
        <footer 
            className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-card-dark/80 border-t border-gray-200 dark:border-gray-800" 
            style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
        >
            <div className="flex justify-around items-center max-w-xl mx-auto h-20">
                {navItems.map((item) => {
                    const isActive = activeTab === item.name;
                    const IconComponent = item.icon;
                    return (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className="flex flex-col items-center justify-center gap-1 text-xs font-medium w-full h-full transition-colors"
                        >
                            <IconComponent className={isActive ? 'text-accent-green' : 'text-gray-500 dark:text-gray-400'} strokeWidth={1.5}/>
                            <span className={isActive ? 'text-accent-green' : 'text-gray-500 dark:text-gray-400'}>
                                {item.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </footer>
    );
};

export default BottomNav;