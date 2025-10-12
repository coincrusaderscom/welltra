import React, { useState, useEffect } from 'react';

export function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      const value = item ? JSON.parse(item) : initialValue;
      
      // Special handling for theme on initial load
      if (key === 'theme') {
        if (value === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      return value;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // Special handling for theme on change
        if (key === 'theme') {
            if (valueToStore === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}