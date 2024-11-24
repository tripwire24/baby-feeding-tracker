import React, { useState, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { Header } from './components/Header';
import { Timer } from './components/Timer';
import { AmountControl } from './components/AmountControl';
import { FeedingHistory } from './components/FeedingHistory';
import { FeedingSession } from './types';

function App() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [activeSession, setActiveSession] = useState<FeedingSession | null>(null);
  const [amount, setAmount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const feedingSessions = useLiveQuery(
    () => db.feedingSessions.orderBy('startTime').reverse().limit(50).toArray()
  );

  useEffect(() => {
    let interval: number;
    if (activeSession) {
      interval = window.setInterval(() => {
        setElapsedTime(Date.now() - activeSession.startTime.getTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const toggleFeedingSession = async () => {
    if (activeSession) {
      const endTime = new Date();
      const duration = endTime.getTime() - activeSession.startTime.getTime();
      
      await db.feedingSessions.add({
        ...activeSession,
        endTime,
        duration,
        amount: amount > 0 ? amount : undefined,
      });

      setActiveSession(null);
      setAmount(0);
      setElapsedTime(0);

      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
    } else {
      setActiveSession({
        startTime: new Date(),
        type: 'bottle',
      });
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-md mx-auto px-4 py-8">
        <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

        <main className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <Timer elapsedTime={elapsedTime} />

            <div className="flex flex-col items-center space-y-4">
              {activeSession && (
                <AmountControl amount={amount} onAmountChange={setAmount} />
              )}

              <button
                onClick={toggleFeedingSession}
                className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-colors ${
                  activeSession
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {activeSession ? 'Stop Feeding' : 'Start Feeding'}
              </button>
            </div>
          </div>

          <FeedingHistory
            showHistory={showHistory}
            onToggleHistory={() => setShowHistory(!showHistory)}
            sessions={feedingSessions}
          />
        </main>
      </div>
    </div>
  );
}

export default App;