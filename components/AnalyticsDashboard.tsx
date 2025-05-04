import { BarChart2, Calendar, TrendingUp, Award, Clock, Target } from 'lucide-react';
import { Goal, MeditationSession } from '../types';

interface AnalyticsDashboardProps {
  goals: Goal[];
  sessions: MeditationSession[];
  completionRate: () => number;
}

export function AnalyticsDashboard({ goals, sessions, completionRate }: AnalyticsDashboardProps) {
  // Calculate statistics
  const today = new Date().toISOString().split('T')[0];
  
  // Daily stats
  const todayGoals = goals.filter(g => g.date === today);
  const todayCompleted = todayGoals.filter(g => g.completed).length;
  const todayMeditation = sessions
    .filter(s => s.date === today)
    .reduce((acc, curr) => acc + curr.duration, 0);

  // Weekly stats (last 7 days)
  const getDateRange = (days: number) => {
    const dates = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weeklyDates = getDateRange(7);
  const weeklyGoals = weeklyDates.map(date => ({
    date,
    total: goals.filter(g => g.date === date).length,
    completed: goals.filter(g => g.date === date && g.completed).length,
    meditation: sessions
      .filter(s => s.date === date)
      .reduce((acc, curr) => acc + curr.duration, 0)
  }));

  const weeklyCompletionRate = Math.round(
    (weeklyGoals.reduce((acc, curr) => acc + curr.completed, 0) /
    (weeklyGoals.reduce((acc, curr) => acc + curr.total, 0) || 1)) * 100
  );

  // Monthly stats (last 30 days)
  const monthlyDates = getDateRange(30);
  const monthlyCompletionRate = Math.round(
    ((monthlyDates.reduce((acc, date) => acc + goals.filter(g => g.date === date && g.completed).length, 0) /
    (monthlyDates.reduce((acc, date) => acc + goals.filter(g => g.date === date).length, 0) || 1)) * 100)
  );

  // Streak calculation
  const calculateStreak = () => {
    let streak = 0;
    const dates = getDateRange(30).reverse(); // Oldest to newest
    
    for (const date of dates) {
      const dateGoals = goals.filter(g => g.date === date);
      if (dateGoals.length === 0) continue; // Skip days with no goals
      if (dateGoals.every(g => g.completed)) {
        streak++;
      } else {
        break; // Streak ends
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Helper function to get current week days in correct order
function getCurrentWeekDays() {
  const days = [];
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  
  // Start from Sunday of current week
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - dayOfWeek);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    days.push({
      date: date.toISOString().split('T')[0],
      dayShort: date.toLocaleDateString('en', { weekday: 'short' })
    });
  }
  
  return days;
}


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart2 className="text-primary" />
        <h2 className="text-xl font-semibold">Your Analytics</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-accent/10 border">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-primary" />
            <span className="text-sm font-medium">Today</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold">{todayCompleted}/{todayGoals.length}</p>
              <p className="text-xs text-muted-foreground">Goals completed</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{todayMeditation} min</p>
              <p className="text-xs text-muted-foreground">Meditation</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-accent/10 border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-primary" />
            <span className="text-sm font-medium">Weekly</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold">{weeklyCompletionRate}%</p>
              <p className="text-xs text-muted-foreground">Completion rate</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {weeklyGoals.reduce((acc, day) => acc + day.meditation, 0)} min
              </p>
              <p className="text-xs text-muted-foreground">Total meditation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="space-y-4">
  <div>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Target size={16} className="text-primary" />
        <span className="font-medium">Weekly Progress</span>
      </div>
      <span className="text-sm text-muted-foreground">
        {weeklyCompletionRate}% avg
      </span>
    </div>
    <div className="h-40 bg-accent/5 rounded-lg p-2">
      <div className="flex h-full gap-1">
        {getCurrentWeekDays().map(({date, dayShort}, i) => {
          const dayGoals = goals.filter(g => g.date === date);
          const dayCompleted = dayGoals.filter(g => g.completed).length;
          const completionPercent = dayGoals.length > 0 
            ? (dayCompleted / dayGoals.length) * 100 
            : 0;
          
          return (
            <div key={i} className="flex-1 flex flex-col justify-end items-center">
              <div 
                className="bg-primary rounded-t-sm relative w-full min-w-[20px] hover:bg-primary/80 transition-colors"
                style={{ height: `${completionPercent}%` }}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] whitespace-nowrap">
                  {dayShort}
                </span>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">
                  {dayCompleted}/{dayGoals.length}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>

  <div>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-primary" />
        <span className="font-medium">Meditation This Week</span>
      </div>
      <span className="text-sm text-muted-foreground">
        {weeklyGoals.reduce((acc, day) => acc + day.meditation, 0)} min
      </span>
    </div>
    <div className="h-40 bg-accent/5 rounded-lg p-2">
      <div className="flex h-full gap-1">
        {getCurrentWeekDays().map(({date, dayShort}, i) => {
          const dayMeditation = sessions
            .filter(s => s.date === date)
            .reduce((acc, curr) => acc + curr.duration, 0);
          const maxMeditation = Math.max(...weeklyGoals.map(d => d.meditation), 10);
          const heightPercent = (dayMeditation / maxMeditation) * 100;
          
          return (
            <div key={i} className="flex-1 flex flex-col justify-end items-center">
              <div 
                className="bg-blue-500 rounded-t-sm relative w-full hover:bg-blue-600 transition-colors"
                style={{ height: `${heightPercent}%` }}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px]">
                  {dayShort}
                </span>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">
                  {dayMeditation || '0'}m
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>


      {/* Achievements */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Award size={16} className="text-primary" />
          <span className="font-medium">Achievements</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border">
            <p className="text-2xl font-bold">{currentStreak} days</p>
            <p className="text-sm text-muted-foreground">Current streak</p>
          </div>
          
          <div className="p-3 rounded-lg border">
            <p className="text-2xl font-bold">{monthlyCompletionRate}%</p>
            <p className="text-sm text-muted-foreground">Monthly completion</p>
          </div>
          
          <div className="p-3 rounded-lg border">
            <p className="text-2xl font-bold">
              {goals.filter(g => g.completed).length}
            </p>
            <p className="text-sm text-muted-foreground">Total goals done</p>
          </div>
          
          <div className="p-3 rounded-lg border">
            <p className="text-2xl font-bold">
              {sessions.reduce((acc, curr) => acc + curr.duration, 0)} min
            </p>
            <p className="text-sm text-muted-foreground">Total meditation</p>
          </div>
        </div>
      </div>
    </div>
  );
}