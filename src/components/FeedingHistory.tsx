import React from 'react';
import { History, Timer, Edit2, Save, X, Trash2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { FeedingSession } from '../types';
import { formatTime } from '../utils/formatTime';

interface FeedingHistoryProps {
  showHistory: boolean;
  onToggleHistory: () => void;
  sessions: FeedingSession[] | undefined;
  onUpdateAmount: (sessionId: string, newAmount: number) => void;
  onDeleteSession: (sessionId: string) => void;
}

export function FeedingHistory({ 
  showHistory, 
  onToggleHistory, 
  sessions,
  onUpdateAmount,
  onDeleteSession
}: FeedingHistoryProps) {
  const [editingSession, setEditingSession] = React.useState<string | null>(null);
  const [editAmount, setEditAmount] = React.useState<number>(0);

  // Group sessions by date
  const groupedSessions = React.useMemo(() => {
    if (!sessions) return new Map();
    
    const groups = new Map();
    
    sessions.forEach(session => {
      const dateKey = format(session.startTime, 'yyyy-MM-dd');
      if (!groups.has(dateKey)) {
        groups.set(dateKey, {
          date: session.startTime,
          sessions: [],
          totalTime: 0,
          totalMl: 0
        });
      }
      
      const group = groups.get(dateKey);
      group.sessions.push(session);
      group.totalTime += session.duration || 0;
      group.totalMl += session.amount || 0;
    });
    
    return groups;
  }, [sessions]);

  const handleStartEdit = (session: FeedingSession) => {
    setEditingSession(session.id);
    setEditAmount(session.amount || 0);
  };

  const handleSaveEdit = (sessionId: string) => {
    onUpdateAmount(sessionId, editAmount);
    setEditingSession(null);
  };

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
        <div className="space-y-6">
          {Array.from(groupedSessions.entries()).map(([dateKey, group]) => (
            <div key={dateKey} className="space-y-3">
              <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {format(group.date, 'EEEE, MMMM d')}
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total: {formatTime(group.totalTime)} | {group.totalMl}ml
                </div>
              </div>

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
