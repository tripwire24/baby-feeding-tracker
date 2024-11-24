import React from 'react';
import { formatTime } from '../utils/formatTime';

interface TimerProps {
  elapsedTime: number;
}

export function Timer({ elapsedTime }: TimerProps) {
  return (
    <div className="text-center mb-4">
      <div className="text-4xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
        {formatTime(elapsedTime)}
      </div>
    </div>
  );
}