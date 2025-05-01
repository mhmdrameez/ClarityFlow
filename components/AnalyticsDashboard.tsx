import { BarChart2 } from 'lucide-react';
import { Goal, MeditationSession } from '../types';

interface AnalyticsDashboardProps {
  goals: Goal[];
  sessions: MeditationSession[];
  completionRate: () => number;
}

export function AnalyticsDashboard({ goals, sessions, completionRate }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Progress</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-accent/10">
          <p className="text-sm text-muted-foreground">Today's Completion</p>
          <p className="text-2xl font-bold">{completionRate()}%</p>
        </div>
        <div className="p-4 rounded-lg bg-accent/10">
          <p className="text-sm text-muted-foreground">Meditation</p>
          <p className="text-2xl font-bold">
            {sessions.filter(s => s.date === new Date().toISOString().split('T')[0])
              .reduce((acc, curr) => acc + curr.duration, 0)} min
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Weekly Goal Streak</h3>
        <div className="flex gap-1">
          {Array(7).fill(0).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const hasGoals = goals.some(g => g.date === dateStr);
            const allCompleted = hasGoals && 
              goals.filter(g => g.date === dateStr).every(g => g.completed);
            
            return (
              <div 
                key={i}
                className={`h-8 flex-1 rounded ${allCompleted ? 'bg-green-500' : hasGoals ? 'bg-yellow-500' : 'bg-gray-200'}`}
                title={dateStr}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}