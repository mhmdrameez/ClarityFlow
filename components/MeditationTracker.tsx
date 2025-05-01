import { Activity } from 'lucide-react';
import { MeditationSession } from '../types';

interface MeditationTrackerProps {
  sessions: MeditationSession[];
  logMeditation: (minutes: number) => void;
}

export function MeditationTracker({ sessions, logMeditation }: MeditationTrackerProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Meditation</h2>
      <div className="grid grid-cols-3 gap-2">
        {[1, 5, 10, 15, 20, 30].map(min => (
          <button
            key={min}
            onClick={() => logMeditation(min)}
            className="p-4 rounded-lg border hover:bg-accent/10"
          >
            {min} min
          </button>
        ))}
      </div>
      <div className="mt-4">
        <h3 className="font-medium">Today's Sessions</h3>
        {sessions.filter(s => s.date === new Date().toISOString().split('T')[0]).map(session => (
          <div key={session.id} className="p-2 border-b">
            {session.duration} minutes
          </div>
        ))}
      </div>
    </div>
  );
}