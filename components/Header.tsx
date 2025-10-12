import React from 'react';
import { Sun, Moon, Plus } from 'lucide-react';

type Theme = 'light' | 'dark';

interface HeaderProps {
  title: string;
  onAddClick: () => void;
  showAddButton: boolean;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ title, onAddClick, showAddButton, theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="text-gray-900 dark:text-accent-green rounded-full h-12 w-12 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-card-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cream dark:focus:ring-offset-dark-green focus:ring-accent-green"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          {showAddButton && (
            <button 
              onClick={onAddClick}
              className="bg-accent-green text-dark-green rounded-full h-12 w-12 flex items-center justify-center hover:bg-light-green transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cream dark:focus:ring-offset-dark-green focus:ring-accent-green"
              aria-label="Add new weight entry"
            >
              <Plus size={32} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;