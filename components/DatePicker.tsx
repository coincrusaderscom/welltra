import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  maxDate?: string;
}

const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, maxDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = useMemo(() => new Date(value + 'T00:00:00'), [value]);
  const [viewDate, setViewDate] = useState(selectedDate);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  
  useEffect(() => {
    setViewDate(selectedDate);
  }, [selectedDate]);


  const daysInMonth = useMemo(() => {
    const date = viewDate;
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => null);
    
    return [...blanks, ...days];
  }, [viewDate]);
  
  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(newDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };
  
  const changeMonth = (offset: number) => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  const isToday = (day: number) => {
    const today = new Date();
    return viewDate.getFullYear() === today.getFullYear() &&
           viewDate.getMonth() === today.getMonth() &&
           day === today.getDate();
  };
  
  const isSelected = (day: number) => {
    return viewDate.getFullYear() === selectedDate.getFullYear() &&
           viewDate.getMonth() === selectedDate.getMonth() &&
           day === selectedDate.getDate();
  };
  
  const isDisabled = (day: number) => {
    if (!maxDate) return false;
    const dateToCheck = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const max = new Date(maxDate + 'T00:00:00');
    return dateToCheck > max;
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-dark-green border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-accent-green focus:border-accent-green transition-shadow"
      >
        <span>{formatDate(selectedDate)}</span>
        <CalendarIcon size={20} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-card-dark border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10 p-4">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-green"><ChevronLeft size={20}/></button>
            <span className="font-semibold">{viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-green"><ChevronRight size={20}/></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="text-gray-500 dark:text-gray-400 font-medium">{day.slice(0, 2)}</div>)}
            {daysInMonth.map((day, index) => (
              day ? (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  disabled={isDisabled(day)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors
                    ${isDisabled(day) ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-dark-green'}
                    ${isSelected(day) ? 'bg-accent-green text-dark-green font-bold' : ''}
                    ${!isSelected(day) && isToday(day) ? 'text-accent-green border border-accent-green' : ''}
                  `}
                >
                  {day}
                </button>
              ) : <div key={`blank-${index}`}></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
