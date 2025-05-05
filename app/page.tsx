'use client';
import { useState, useEffect } from 'react';
import { Goal, MeditationSession, Visualization, Affirmation, GratitudeEntry, Prayer } from '../types';
import { NavigationTabs } from '../components/NavigationTabs';
import { GoalTracker } from '../components/GoalTracker';
import { MeditationTracker } from '../components/MeditationTracker';
import { VisualizationTracker } from '../components/VisualizationTracker';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { AffirmationsTracker } from '../components/AffirmationsTracker';
import { GratitudeTracker } from '../components/GratitudeTracker';
import { InstallPrompt } from '../components/InstallPrompt';
import { Plus } from 'lucide-react';
import { NotificationSettings } from '../components/NotificationSettings';
import { PrayerTracker } from '@/components/PrayerTracker';



export default function WellnessApp() {
  const [activeTab, setActiveTab] = useState<'goals' | 'meditate' | 'visualize' | 'analytics' | 'affirmations' | 'gratitude' | 'settings' | 'prayer'>('goals');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Add to your state
const [prayers, setPrayers] = useState<Prayer[]>([]);



// Prayer state changes will be handled by the main useEffect that saves data to localStorage

// Add these prayer functions
const togglePrayer = (id: string) => {
  setPrayers(prayers.map(p => 
    p.id === id ? { ...p, completed: !p.completed } : p
  ));
};

const addPrayerTime = (name: string, time: string) => {
  const today = new Date().toISOString().split('T')[0];
  const existingPrayer = prayers.find(p => 
    p.date === today && p.name === name
  );

  if (existingPrayer) {
    setPrayers(prayers.map(p =>
      p.id === existingPrayer.id ? { ...p, time } : p
    ));
  } else {
    setPrayers([...prayers, {
      id: Date.now().toString(),
      name: name as any,
      completed: false,
      date: today,
      time
    }]);
  }
};



  

  // Add this to your WellnessApp component
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            console.log('Notification permission granted');
            
            // Schedule notifications after permission is granted
            await scheduleDailyNotifications();
            
            // Register periodic sync (if supported)
            if ('periodicSync' in (navigator as any)) {
              try {
                await (navigator as any).periodicSync.register('daily-reminders', {
                  minInterval: 24 * 60 * 60 * 1000 // 1 day
                });
                console.log('Periodic sync registered');
              } catch (err) {
                console.log('Periodic sync could not be registered', err);
              }
            }
          }
        } catch (err) {
          console.error('Notification permission error:', err);
        }
      }
    };

    requestNotificationPermission();
  }, []); // Empty dependency array means this runs once on mount

  // Move scheduleDailyNotifications inside the component but outside of any effects
  const scheduleDailyNotifications = async () => {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      const registration = await navigator.serviceWorker.ready;
      
      // Get current time in IST
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
      const istTime = new Date(now.getTime() + istOffset);
      
      // Schedule morning notification at 8 AM IST
      const morningTime = new Date(istTime);
      morningTime.setHours(8, 0, 0, 0);
      if (morningTime < istTime) {
        morningTime.setDate(morningTime.getDate() + 1);
      }
      const morningDelay = morningTime.getTime() - istTime.getTime();
      
      setTimeout(() => {
        registration.showNotification('Morning Reminder', {
          body: '🌞 Start your day with positive visualizations!',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png'
        });
      }, morningDelay);
      
      // Schedule evening notification at 8 PM IST
      const eveningTime = new Date(istTime);
      eveningTime.setHours(20, 0, 0, 0);
      if (eveningTime < istTime) {
        eveningTime.setDate(eveningTime.getDate() + 1);
      }
      const eveningDelay = eveningTime.getTime() - istTime.getTime();
      
      setTimeout(() => {
        registration.showNotification('Evening Reminder', {
          body: '🌙 Reflect on your visualizations before bed',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png'
        });
      }, eveningDelay);
    }
  };

// Call this after getting notification permission
// You might want to put this in the permission granted callback
scheduleDailyNotifications();

  // Load data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure this runs only on the client
      const savedGoals = localStorage.getItem('wellness-goals');
      const savedSessions = localStorage.getItem('meditation-sessions');
      const savedViz = localStorage.getItem('visualizations');
      const savedAffirmations = localStorage.getItem('affirmations');
      const savedGratitude = localStorage.getItem('gratitude-entries');
      const savedDarkMode = localStorage.getItem('dark-mode');
      const savedPrayers = localStorage.getItem('prayers');

      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedSessions) setSessions(JSON.parse(savedSessions));
      if (savedViz) setVisualizations(JSON.parse(savedViz));
      if (savedAffirmations) setAffirmations(JSON.parse(savedAffirmations));
      if (savedGratitude) setGratitudeEntries(JSON.parse(savedGratitude));
      if (savedDarkMode) {
        setDarkMode(savedDarkMode === 'true');
        document.documentElement.classList.toggle('dark', savedDarkMode === 'true');
      }
      if (savedPrayers) setPrayers(JSON.parse(savedPrayers));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure this runs only on the client
      localStorage.setItem('wellness-goals', JSON.stringify(goals));
      localStorage.setItem('meditation-sessions', JSON.stringify(sessions));
      localStorage.setItem('visualizations', JSON.stringify(visualizations));
      localStorage.setItem('affirmations', JSON.stringify(affirmations));
      localStorage.setItem('gratitude-entries', JSON.stringify(gratitudeEntries));
      localStorage.setItem('dark-mode', darkMode.toString());
      localStorage.setItem('prayers', JSON.stringify(prayers));
    }
  }, [goals, sessions, visualizations, affirmations, gratitudeEntries, darkMode, prayers]);


  // Delete functions
  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const deleteVisualization = (id: string) => {
    setVisualizations(visualizations.filter(viz => viz.id !== id));
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const deleteAffirmation = (id: string) => {
    setAffirmations(affirmations.filter(a => a.id !== id));
  };

  const deleteGratitudeEntry = (id: string) => {
    setGratitudeEntries(gratitudeEntries.filter(entry => entry.id !== id));
  };

  // Goal functions
  const addGoal = () => {
    if (!input.trim()) return;
    setGoals([...goals, {
      id: Date.now().toString(),
      text: input,
      completed: false,
      date: new Date().toISOString().split('T')[0],
      category: 'focus'
    }]);
    setInput('');
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  // Meditation functions
  const logMeditation = (minutes: number) => {
    setSessions([...sessions, {
      id: Date.now().toString(),
      duration: minutes,
      date: new Date().toISOString().split('T')[0]
    }]);
  };

// In your WellnessApp component, update the addVisualization function:
// In your WellnessApp component
const addVisualization = (desc: string, timeframe?: string) => {
  const newVisualization: Visualization = {
    id: Date.now().toString(),
    description: desc,
    date: new Date().toISOString().split('T')[0],
    timeframe: timeframe || undefined
  };
  setVisualizations([...visualizations, newVisualization]);
};



  // Affirmation functions
  const addAffirmation = (text: string) => {
    if (!text.trim()) return;
    setAffirmations([...affirmations, {
      id: Date.now().toString(),
      text,
      date: new Date().toISOString().split('T')[0],
      favorite: false
    }]);
    setInput('');
  };

  const toggleFavorite = (id: string) => {
    setAffirmations(affirmations.map(a => 
      a.id === id ? { ...a, favorite: !a.favorite } : a
    ));
  };

  // Gratitude functions
  const addGratitudeEntry = (text: string) => {
    if (!text.trim()) return;
    setGratitudeEntries([...gratitudeEntries, {
      id: Date.now().toString(),
      text,
      date: new Date().toISOString().split('T')[0],
      category: 'general',
      favorite: false
    }]);
    setInput('');
  };

  // Analytics calculations
  const completionRate = () => {
    const todayGoals = goals.filter(g => g.date === new Date().toISOString().split('T')[0]);
    return todayGoals.length
      ? Math.round((todayGoals.filter(g => g.completed).length / todayGoals.length) * 100)
      : 0;
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };



  const [isStandalone, setIsStandalone] = useState(false); // Detect if the app is installed
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null); // Store the beforeinstallprompt event
  const [isIOS, setIsIOS] = useState(false); // Detect if the user is on iOS

  useEffect(() => {
    // Detect if the app is running in standalone mode
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone
    );

    // Detect if the user is on iOS
    const userAgent = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream);

    // Listen for the beforeinstallprompt event (for Android and desktop)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault(); // Prevent the default mini-infobar from appearing
      setDeferredPrompt(e); // Save the event for later use
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (isIOS) {
      // Show instructions for iOS users
      alert(
        'To install this app, tap the "Share" button in Safari and select "Add to Home Screen".'
      );
    } else if (deferredPrompt) {
      // Show the install prompt for Android and desktop
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null); // Clear the saved prompt
      });
    } else {
      console.log('Install prompt is not available');
    }
  };


  return (
    <div className="min-h-screen max-w-md mx-auto p-4">

<header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ClarityFlow</h1>
          <p className="text-muted-foreground">Stay focused. Grow daily. Live mindfully.</p>
        </div>
        {!isStandalone && ( 
          <button
            onClick={handleInstallClick} 
            className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            aria-label="Install App"
          >
            <Plus size={20} /> 
          </button>
        )}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-accent/10 transition-colors"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
      </header>

      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'goals' && (
        <GoalTracker
          goals={goals}
          input={input}
          setInput={setInput}
          addGoal={addGoal}
          toggleGoal={toggleGoal}
          deleteGoal={deleteGoal}
        />
      )}

      {activeTab === 'meditate' && (
        <MeditationTracker
          sessions={sessions}
          logMeditation={logMeditation}
          deleteSession={deleteSession}
        />
      )}

      {activeTab === 'visualize' && (
        <VisualizationTracker
          visualizations={visualizations}
          input={input}
          setInput={setInput}
          addVisualization={addVisualization}
          deleteVisualization={deleteVisualization}
        />
      )}

      {activeTab === 'affirmations' && (
        <AffirmationsTracker
          affirmations={affirmations}
          input={input}
          setInput={setInput}
          addAffirmation={addAffirmation}
          deleteAffirmation={deleteAffirmation}
          toggleFavorite={toggleFavorite}
        />
      )}


      {activeTab === 'gratitude' && (
        <GratitudeTracker
          entries={gratitudeEntries}
          input={input}
          setInput={setInput}
          addEntry={addGratitudeEntry}
          deleteEntry={deleteGratitudeEntry}
        />
      )}

{activeTab === 'prayer' && (
  <PrayerTracker
    prayers={prayers}
    togglePrayer={togglePrayer}
    addPrayerTime={addPrayerTime}
  />
)}


      {activeTab === 'analytics' && (
        <AnalyticsDashboard
          goals={goals}
          sessions={sessions}
          completionRate={completionRate}
        />
      )}

{activeTab === 'settings' && (
  <NotificationSettings />
)}

      

<footer className="mt-8 py-4 text-center text-sm text-muted-foreground border-t">
  <p>
    ClarityFlow v1.4 ✨ | © {new Date().getFullYear()} 
  </p>
</footer>

    </div>
  );
}