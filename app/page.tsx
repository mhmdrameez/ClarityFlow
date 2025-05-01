'use client';
import { useState, useEffect } from 'react';
import { Goal, MeditationSession, Visualization } from '../types';
import { NavigationTabs } from '../components/NavigationTabs';
import { GoalTracker } from '../components/GoalTracker';
import { MeditationTracker } from '../components/MeditationTracker';
import { VisualizationTracker } from '../components/VisualizationTracker';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';

export default function WellnessApp() {
  const [activeTab, setActiveTab] = useState<'goals' | 'meditate' | 'visualize' | 'analytics'>('goals');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [input, setInput] = useState('');
  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };
  const deleteVisualization = (id: string) => {
    setVisualizations(visualizations.filter(viz => viz.id !== id));
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  // Load all data
  useEffect(() => {
    const loadData = () => {
      const savedGoals = localStorage.getItem('wellness-goals');
      const savedSessions = localStorage.getItem('meditation-sessions');
      const savedViz = localStorage.getItem('visualizations');

      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedSessions) setSessions(JSON.parse(savedSessions));
      if (savedViz) setVisualizations(JSON.parse(savedViz));
    };
    loadData();
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('wellness-goals', JSON.stringify(goals));
    localStorage.setItem('meditation-sessions', JSON.stringify(sessions));
    localStorage.setItem('visualizations', JSON.stringify(visualizations));
  }, [goals, sessions, visualizations]);

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

  // Analytics calculations
  const completionRate = () => {
    const todayGoals = goals.filter(g => g.date === new Date().toISOString().split('T')[0]);
    return todayGoals.length
      ? Math.round((todayGoals.filter(g => g.completed).length / todayGoals.length) * 100)
      : 0;
  };

  return (
    <div className="min-h-screen max-w-md mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">MindForge</h1>
        <p className="text-muted-foreground">Holistic productivity system</p>
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

      {activeTab === 'analytics' && (
        <AnalyticsDashboard
          goals={goals}
          sessions={sessions}
          completionRate={completionRate}
        />
      )}
    </div>
  );
}