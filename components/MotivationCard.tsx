import React, { useState, useEffect } from 'react';
import { getMotivationalQuote } from '../services/geminiService';
import { Quote } from 'lucide-react';

const MotivationCard: React.FC = () => {
  const [quote, setQuote] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      setIsLoading(true);
      const newQuote = await getMotivationalQuote();
      setQuote(newQuote);
      setIsLoading(false);
    };
    
    fetchQuote();
  }, []);

  return (
    <div className="relative bg-white dark:bg-card-dark p-6 rounded-2xl flex items-center justify-center min-h-[150px] shadow-sm overflow-hidden transition-all duration-300">
        <Quote size={80} className="absolute -top-2 -left-2 text-gray-100 dark:text-dark-green opacity-80" strokeWidth={1.5} />
         <div className="relative text-center z-10">
            {isLoading ? (
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                    Loading inspiration...
                </p>
            ) : (
                <p className="text-2xl font-serif italic text-gray-800 dark:text-gray-100 tracking-normal">
                "{quote}"
                </p>
            )}
        </div>
    </div>
  );
};

export default MotivationCard;