// components/PrayerTracker.tsx
'use client';

import { Check, Clock, Landmark, Plus, Minus, RotateCw, Play, Pause, Settings } from 'lucide-react';
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

  // Dhikr counter state
  const [dhikrCount, setDhikrCount] = useState(0);
  const [isAutoCounting, setIsAutoCounting] = useState(false);
  const [autoCountInterval, setAutoCountInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedDhikr, setSelectedDhikr] = useState('SubhanAllah');
  const [countInterval, setCountInterval] = useState(1); // Default 1 second
  const [showIntervalSettings, setShowIntervalSettings] = useState(false);

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

  // Auto counting effect
  useEffect(() => {
    if (isAutoCounting) {
      const interval = setInterval(() => {
        setDhikrCount(prev => prev + 1);
      }, countInterval * 1000); // Convert seconds to milliseconds
      setAutoCountInterval(interval);
    } else if (autoCountInterval) {
      clearInterval(autoCountInterval);
      setAutoCountInterval(null);
    }

    return () => {
      if (autoCountInterval) clearInterval(autoCountInterval);
    };
  }, [isAutoCounting, countInterval]);

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
      togglePrayer(existingPrayer.id);
    } else {
      const defaultTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(/^24/, '00');
      
      addPrayerTime(name, prayerTimes[name] || defaultTime);
    }
  };

  // Dhikr counter functions
  const handleIncrementDhikr = () => {
    setDhikrCount(prev => prev + 1);
  };

  const handleDecrementDhikr = () => {
    if (dhikrCount > 0) {
      setDhikrCount(prev => prev - 1);
    }
  };

  const handleResetDhikr = () => {
    setDhikrCount(0);
    if (isAutoCounting) {
      setIsAutoCounting(false);
    }
  };

  const toggleAutoCounting = () => {
    setIsAutoCounting(prev => !prev);
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0.1 && value <= 60) {
      setCountInterval(value);
    }
  };

  const dhikrOptions = [
    { value: 'SubhanAllah', label: 'سُبْحَانَ ٱللَّٰهِ ' },
    { value: 'Alhamdulillah', label: 'ٱلْحَمْدُ لِلَّٰهِ ' },
    { value: 'AllahuAkbar', label: 'اللّٰهُ أَكْبَرُ ' },
    { value: 'LaIlahaIllallah', label: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ ' },
    { value: 'Astaghfirullah', label: 'أَسْتَغْفِرُ ٱللَّٰهَ ' },
    { value: 'Swalath', label: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ' },
  ];

  return (
    <div className="space-y-6">
      {/* Prayer Times Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
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

      {/* Dhikr Counter Section */}
      <div className="space-y-4 pt-6 border-t">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>Dhikr Counter</span>
          <button 
            onClick={() => setShowIntervalSettings(!showIntervalSettings)}
            className="text-muted-foreground hover:text-primary"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </h2>

        {showIntervalSettings && (
          <div className="p-3 bg-accent/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="interval" className="text-sm font-medium">
                Auto-count Interval (seconds):
              </label>
              <span className="text-sm font-mono bg-background px-2 py-1 rounded">
                {countInterval.toFixed(1)}s
              </span>
            </div>
            <input
              id="interval"
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={countInterval}
              onChange={handleIntervalChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0.1s</span>
              <span>10s</span>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center space-y-4 p-4 bg-accent/10 rounded-lg">
          <select
            value={selectedDhikr}
            onChange={(e) => setSelectedDhikr(e.target.value)}
            className="w-full max-w-xs p-2 border rounded-md bg-background"
          >
            {dhikrOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="text-4xl font-bold text-center py-4">
            {dhikrCount}
            {isAutoCounting && (
              <span className="block text-sm font-normal text-muted-foreground">
                Auto-counting every {countInterval.toFixed(1)}s
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleDecrementDhikr}
              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              aria-label="Decrement count"
            >
              <Minus size={20} />
            </button>
            
            <button
              onClick={handleIncrementDhikr}
              className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              aria-label="Increment count"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleAutoCounting}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                isAutoCounting 
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
              aria-label={isAutoCounting ? 'Pause auto counting' : 'Start auto counting'}
            >
              {isAutoCounting ? <Pause size={18} /> : <Play size={18} />}
              {isAutoCounting ? 'Pause' : 'Auto Count'}
            </button>
            
            <button
              onClick={handleResetDhikr}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-2"
              aria-label="Reset counter"
            >
              <RotateCw size={18} />
              Reset
            </button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground text-center">
          <p>"{selectedDhikr}" - Recite and remember Allah</p>
        </div>
      </div>
    </div>
  );
}