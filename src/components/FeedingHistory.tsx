import React from 'react';
import { History, Timer, Edit2, Save, X, Trash2 } from 'lucide-react';
import { formatDistanceToNow, format, isSameDay } from 'date-fns';
import { FeedingSession } from '../types';
import { formatTime } from '../utils/formatTime';

interface FeedingHistoryProps {
  showHistory: boolean;
  onToggleHistory: () => void;
  sessions: FeedingSession[] | undefined;
  onUpdateAmount: (sessionId: string, newAmount: number) => void;
  onDeleteSession: (sessionId: string) => void;  // Add this line
}

export function FeedingHistory({ 
  showHistory, 
  onToggleHistory, 
  sessions,
  onUpdateAmount,
  onDeleteSession  // Add this line
}: FeedingHistoryProps) {
  const [editingSession, setEditingSession] = React.useState<string | null>(null);
  const [editAmount, setEditAmount] = React.useState<number>(0);

  // ... rest of your existing code ...

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      {/* ... existing code ... */}
      {showHistory && sessions && (
        <div className="space-y-6">
          {Array.from(groupedSessions.entries()).map(([dateKey, group]) => (
            <div key={dateKey} className="space-y-3">
              {/* ... existing date header code ... */}
              <div className="space-y-3">
                {group.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {format(session.startTime, 'h:mm a')}
                      </div>
                      {editingSession === session.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                          />
                          <button
                            onClick={() => handleSaveEdit(session.id)}
                            className="p-1 text-green-500 hover:text-green-600"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingSession(null)}
                            className="p-1 text-red-500 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="text-gray-900 dark:text-white font-medium">
                            {session.amount}ml
                          </div>
                          <button
                            onClick={() => handleStartEdit(session)}
                            className="p-1 text-gray-400 hover:text-gray-500"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteSession(session.id)}
                            className="p-1 text-red-400 hover:text-red-500"
                            aria-label="Delete feeding session"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
