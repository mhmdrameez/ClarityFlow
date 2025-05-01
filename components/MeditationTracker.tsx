import { Activity, Play, Pause, RefreshCw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { MeditationSession } from '../types';

interface MeditationTrackerProps {
  sessions: MeditationSession[];
  logMeditation: (minutes: number) => void;
}

export function MeditationTracker({ sessions, logMeditation }: MeditationTrackerProps) {
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreathingIn, setIsBreathingIn] = useState(true);
  const breathRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [lastSpoken, setLastSpoken] = useState<string | null>(null);


   // Text-to-speech with duplicate prevention
   const speakInstruction = (text: string) => {
    if (lastSpoken !== text) {
      speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
      setLastSpoken(text);
    }
  };

  // Handle timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => clearInterval(timerRef.current!);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive) {
      const duration = isBreathingIn ? 4000 : 6000;
      breathRef.current = setTimeout(() => {
        setIsBreathingIn(prev => {
          const next = !prev;
          const instruction = next ? 'Breathe In' : 'Breathe Out';
          speakInstruction(instruction);
          return next;
        });
      }, duration);
    }

    return () => {
      if (breathRef.current) clearTimeout(breathRef.current);
    };
  }, [isActive, isBreathingIn]);

  const startTimer = (minutes: number) => {
    setSelectedMinutes(minutes);
    setTimeLeft(minutes * 60);
    setIsActive(true);
    setIsBreathingIn(true);
    setLastSpoken(null); // Reset last spoken when starting new session
    speakInstruction('Breathe In');
  };

  const toggleTimer = (paused: boolean) => {
    setIsActive(paused);
    if (!paused) {
      speakInstruction(isBreathingIn ? 'Breathe In' : 'Breathe Out');
    } else {
      speechSynthesis.cancel();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedMinutes ? selectedMinutes * 60 : 0);
    speechSynthesis.cancel(); // stop any ongoing speech
  };

  const handleComplete = () => {
    setIsActive(false);
    if (selectedMinutes) {
      logMeditation(selectedMinutes);
    }
    speechSynthesis.cancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date === today);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Activity className="text-primary" size={20} />
        Meditation Timer
      </h2>

      {!selectedMinutes ? (
        <div className="space-y-4">
          <h3 className="font-medium">Select Duration</h3>
          <div className="grid grid-cols-3 gap-3">
            {[1, 3, 5, 10, 15, 20].map(min => (
              <button
                key={min}
                onClick={() => startTimer(min)}
                className="p-4 rounded-lg border hover:bg-accent/10 transition-colors flex flex-col items-center"
              >
                <span className="text-lg font-medium">{min}</span>
                <span className="text-xs text-muted-foreground">minutes</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-5xl font-bold my-6">
              {formatTime(timeLeft)}
            </div>

            {/* Breathing Animation & Instruction */}
            <div className="flex flex-col items-center space-y-3 my-8">
              <div
                className={`rounded-full bg-blue-500 transition-all duration-1000 ease-in-out ${
                  isBreathingIn ? 'w-24 h-24' : 'w-16 h-16'
                }`}
              />
              <div className="text-lg font-semibold text-muted-foreground">
                {isBreathingIn ? 'Breathe In' : 'Breathe Out'}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <button
                onClick={toggleTimer}
                className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isActive ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={resetTimer}
                className="p-3 rounded-full border hover:bg-accent/10"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Previous Sessions */}
      <div className="mt-8">
        <h3 className="font-medium flex items-center justify-between">
          <span>Today's Sessions</span>
          <span className="text-sm text-muted-foreground">
            Total: {todaySessions.reduce((sum, session) => sum + session.duration, 0)} mins
          </span>
        </h3>

        {todaySessions.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground rounded-lg border border-dashed mt-2">
            No sessions today
          </div>
        ) : (
          <div className="space-y-2 mt-3">
            {todaySessions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(session => (
                <div key={session.id} className="p-3 border rounded-lg flex justify-between items-center">
                  <span>{session.duration} minute{session.duration !== 1 ? 's' : ''}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
