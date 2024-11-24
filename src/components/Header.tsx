import React from 'react';
import { Baby, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-2">
        <Baby className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Baby Feeding</h1>
      </div>
      <button
        onClick={onToggleDarkMode}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {darkMode ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-600" />
        )}
      </button>
    </header>
  );
}