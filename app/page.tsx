'use client';
import { useState, useEffect } from 'react';
import { Goal, MeditationSession, Visualization, Affirmation, GratitudeEntry } from '../types';
import { NavigationTabs } from '../components/NavigationTabs';
import { GoalTracker } from '../components/GoalTracker';
import { MeditationTracker } from '../components/MeditationTracker';
import { VisualizationTracker } from '../components/VisualizationTracker';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { AffirmationsTracker } from '../components/AffirmationsTracker';
import { GratitudeTracker } from '../components/GratitudeTracker';
import { InstallPrompt } from '../components/InstallPrompt';


export default function WellnessApp() {
  const [activeTab, setActiveTab] = useState<'goals' | 'meditate' | 'visualize' | 'analytics' | 'affirmations' | 'gratitude'>('goals');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Load all data
  useEffect(() => {
    const loadData = () => {
      const savedGoals = localStorage.getItem('wellness-goals');
      const savedSessions = localStorage.getItem('meditation-sessions');
      const savedViz = localStorage.getItem('visualizations');
      const savedAffirmations = localStorage.getItem('affirmations');
      const savedGratitude = localStorage.getItem('gratitude-entries');
      const savedDarkMode = localStorage.getItem('dark-mode');

      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedSessions) setSessions(JSON.parse(savedSessions));
      if (savedViz) setVisualizations(JSON.parse(savedViz));
      if (savedAffirmations) setAffirmations(JSON.parse(savedAffirmations));
      if (savedGratitude) setGratitudeEntries(JSON.parse(savedGratitude));
      if (savedDarkMode) {
        setDarkMode(savedDarkMode === 'true');
        document.documentElement.classList.toggle('dark', savedDarkMode === 'true');
      }
    };
    loadData();
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('wellness-goals', JSON.stringify(goals));
    localStorage.setItem('meditation-sessions', JSON.stringify(sessions));
    localStorage.setItem('visualizations', JSON.stringify(visualizations));
    localStorage.setItem('affirmations', JSON.stringify(affirmations));
    localStorage.setItem('gratitude-entries', JSON.stringify(gratitudeEntries));
    localStorage.setItem('dark-mode', darkMode.toString());
  }, [goals, sessions, visualizations, affirmations, gratitudeEntries, darkMode]);

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

  // Visualization functions
  const addVisualization = (desc: string) => {
    setVisualizations([...visualizations, {
      id: Date.now().toString(),
      description: desc,
      date: new Date().toISOString().split('T')[0]
    }]);
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

  return (
    <div className="min-h-screen max-w-md mx-auto p-4">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ClarityFlow</h1>
          <p className="text-muted-foreground">Stay focused. Grow daily. Live mindfully.</p>
        </div>
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

      {activeTab === 'analytics' && (
        <AnalyticsDashboard
          goals={goals}
          sessions={sessions}
          completionRate={completionRate}
        />
      )}

<InstallPrompt />
      

<footer className="mt-8 py-4 text-center text-sm text-muted-foreground border-t">
<p>
Vibe coded ✨ by{" "}
<a
    href="https://mhmdrameezweb.netlify.app/"
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