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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useLocalStorage('showInstallBanner', true);

  const feedingSessions = useLiveQuery(
    () => db.feedingSessions.orderBy('startTime').reverse().limit(50).toArray()
  );

  // PWA Install prompt handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

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
        id: Date.now().toString(), // Add unique ID
        startTime: new Date(),
        type: 'bottle',
      });
    }
  };

  const handleUpdateAmount = async (sessionId: string, newAmount: number) => {
    await db.feedingSessions.update(sessionId, { amount: newAmount });
  };
  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this feeding session?')) {
    await db.feedingSessions.delete(sessionId);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {showInstallBanner && deferredPrompt && (
        <div className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white p-4 flex justify-between items-center">
          <span>Install this app for easier access</span>
          <div className="space-x-2">
            <button
              onClick={installPWA}
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium"
            >
              Install
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="px-4 py-2 bg-indigo-500 rounded-lg"
            >
              Later
            </button>
          </div>
        </div>
      )}

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
            onUpdateAmount={handleUpdateAmount}
            onDeleteSession={handleDeleteSession}  // Add this line
          />
        </main>
      </div>
    </div>
  );
}

export default App;
