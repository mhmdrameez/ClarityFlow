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

function MorningVideoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="w-full h-full max-w-4xl max-h-[80vh]">
        <div className="relative w-full h-0 pb-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/OVUXGDf6YSE?autoplay=1&rel=0"
            title="Morning Inspiration"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Close Video
        </button>
      </div>
    </div>
  );
}

export default function WellnessApp() {
  const [activeTab, setActiveTab] = useState<'goals' | 'meditate' | 'visualize' | 'analytics' | 'affirmations' | 'gratitude' | 'settings' | 'prayer'>('goals');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [showMorningVideo, setShowMorningVideo] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  // Check for morning video when component mounts
  useEffect(() => {
    const checkMorningVideo = () => {
      const now = new Date();
      const hours = now.getHours();
      const isMorning = hours >= 5 && hours < 11;
      
      const lastShownDate = localStorage.getItem('lastVideoShownDate');
      const today = new Date().toISOString().split('T')[0];
      
      if (isMorning && lastShownDate !== today) {
        setShowMorningVideo(true);
        localStorage.setItem('lastVideoShownDate', today);
      }
    };

    checkMorningVideo();
  }, []);

  // Notification permission
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        try {
          await Notification.requestPermission();
        } catch (err) {
          console.error('Notification permission error:', err);
        }
      }
    };
    requestNotificationPermission();
  }, []);

  // Install prompt detection
  useEffect(() => {
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone
    );

    const userAgent = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Load data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('wellness-goals', JSON.stringify(goals));
      localStorage.setItem('meditation-sessions', JSON.stringify(sessions));
      localStorage.setItem('visualizations', JSON.stringify(visualizations));
      localStorage.setItem('affirmations', JSON.stringify(affirmations));
      localStorage.setItem('gratitude-entries', JSON.stringify(gratitudeEntries));
      localStorage.setItem('dark-mode', darkMode.toString());
      localStorage.setItem('prayers', JSON.stringify(prayers));
    }
  }, [goals, sessions, visualizations, affirmations, gratitudeEntries, darkMode, prayers]);

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

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  // Meditation functions
  const logMeditation = (minutes: number) => {
    setSessions([...sessions, {
      id: Date.now().toString(),
      duration: minutes,
      date: new Date().toISOString().split('T')[0]
    }]);
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  // Visualization functions
  const addVisualization = (desc: string, timeframe?: string) => {
    setVisualizations([...visualizations, {
      id: Date.now().toString(),
      description: desc,
      date: new Date().toISOString().split('T')[0],
      timeframe: timeframe || undefined
    }]);
  };

  const deleteVisualization = (id: string) => {
    setVisualizations(visualizations.filter(viz => viz.id !== id));
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

  const deleteAffirmation = (id: string) => {
    setAffirmations(affirmations.filter(a => a.id !== id));
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

  const deleteGratitudeEntry = (id: string) => {
    setGratitudeEntries(gratitudeEntries.filter(entry => entry.id !== id));
  };

  // Prayer functions
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

  // Analytics calculation
  const completionRate = () => {
    const todayGoals = goals.filter(g => g.date === new Date().toISOString().split('T')[0]);
    return todayGoals.length
      ? Math.round((todayGoals.filter(g => g.completed).length / todayGoals.length) * 100)
      : 0;
  };

  // Install handler
  const handleInstallClick = () => {
    if (isIOS) {
      alert('To install this app, tap the "Share" button in Safari and select "Add to Home Screen".');
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto p-4 relative">
      {showMorningVideo && <MorningVideoModal onClose={() => setShowMorningVideo(false)} />}

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
          Vibe coded ✨ by{" "}
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline ml-1"
          >
            mhmdrameez
          </a>
        </p>
      </footer>
    </div>
  );
}