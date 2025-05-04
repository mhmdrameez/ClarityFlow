// components/PrayerTracker.tsx
'use client';

import { Check, Clock, Landmark } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Prayer } from '../types';

interface PrayerTrackerProps {
  prayers: Prayer[];
  togglePrayer: (id: string) => void;
  addPrayerTime: (name: string, time: string) => void;
}

export function PrayerTracker({ prayers, togglePrayer, addPrayerTime }: PrayerTrackerProps) {
  const [prayerTimes, setPrayerTimes] = useState<Record<string, string>>({
    Fajr: '',
    Dhuhr: '',
    Asr: '',
    Maghrib: '',
    Isha: ''
  });

  // Initialize prayer times from props
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const initialTimes: Record<string, string> = {};
    
    ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(name => {
      const prayer = prayers.find(p => p.date === today && p.name === name);
      if (prayer?.time) {
        initialTimes[name] = prayer.time;
      } else {
        initialTimes[name] = '';
      }
    });
    
    setPrayerTimes(initialTimes);
  }, [prayers]);

  const todayPrayers = prayers.filter(p => p.date === new Date().toISOString().split('T')[0]);

  const handleTimeChange = (name: string, time: string) => {
    const newPrayerTimes = { ...prayerTimes, [name]: time };
    setPrayerTimes(newPrayerTimes);
    addPrayerTime(name, time);
  };

  const handleTogglePrayer = (name: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingPrayer = todayPrayers.find(p => p.name === name);

    if (existingPrayer) {
      // Toggle existing prayer
      togglePrayer(existingPrayer.id);
    } else {
      // Create new prayer with default time if none exists
      const defaultTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(/^24/, '00');
      
      addPrayerTime(name, prayerTimes[name] || defaultTime);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Landmark size={24} className="text-primary" />
        <h2 className="text-xl font-semibold">Daily Prayers</h2>
      </div>

      <div className="space-y-3">
        {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name) => {
          const prayer = todayPrayers.find(p => p.name === name);
          const time = prayer?.time || prayerTimes[name] || '--:--';
          const isCompleted = prayer?.completed || false;

          return (
            <div key={name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/10 transition-colors">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTogglePrayer(name)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted ? 'bg-green-500 text-white' : 'border border-gray-300'
                  }`}
                  aria-label={`Mark ${name} prayer as ${isCompleted ? 'not completed' : 'completed'}`}
                >
                  {isCompleted && <Check size={16} />}
                </button>
                <span className="font-medium">{name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{time}</span>
                <div className="relative group">
                  <Clock size={16} className="text-primary group-hover:text-primary/80 transition-colors" />
                  <input
                    type="time"
                    value={prayerTimes[name] || ''}
                    onChange={(e) => handleTimeChange(name, e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    aria-label={`Set time for ${name} prayer`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}