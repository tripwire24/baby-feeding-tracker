import React from 'react';
import { History, Timer } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { FeedingSession } from '../types';
import { formatTime } from '../utils/formatTime';

interface FeedingHistoryProps {
  showHistory: boolean;
  onToggleHistory: () => void;
  sessions: FeedingSession[] | undefined;
}

export function FeedingHistory({ showHistory, onToggleHistory, sessions }: FeedingHistoryProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <button
        onClick={onToggleHistory}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 mb-4"
      >
        <History className="w-5 h-5" />
        <span>Feeding History</span>
      </button>

      {showHistory && sessions && (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(session.startTime, { addSuffix: true })}
                </div>
                {session.amount && (
                  <div className="text-gray-900 dark:text-white font-medium">
                    {session.amount}ml
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Timer className="w-4 h-4" />
                <span>{formatTime(session.duration || 0)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}