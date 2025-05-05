import { Check, Activity, Eye, BarChart2, MessageCircle, Heart, Settings, Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: 'goals' | 'meditate' | 'visualize' | 'analytics' | 'affirmations' | 'gratitude' | 'settings' | 'prayer') => void;
}

export function NavigationTabs({ activeTab, setActiveTab }: NavigationTabsProps) {
  const [showPrayerTab, setShowPrayerTab] = useState(true);

  // Load prayer tab setting from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        const storedValue = localStorage.getItem('showPrayerTab');
        setShowPrayerTab(storedValue !== 'false');
        
        // If prayer tab is hidden and it's currently active, switch to goals
        if (storedValue === 'false' && activeTab === 'prayer') {
          setActiveTab('goals');
        }
      }
    };

    // Initial load
    handleStorageChange();

    // Listen for changes in localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for direct updates
    window.addEventListener('prayerTabChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('prayerTabChange', handleStorageChange);
    };
  }, [activeTab, setActiveTab]);

  return (
    <div className="overflow-x-auto">
      <nav className="flex gap-3 mb-6 w-[450px]">
        <button 
          onClick={() => setActiveTab('goals')}
          className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'goals' ? 'bg-accent' : ''}`}
        >
          <Check size={20} />
          <span className="text-xs mt-1">Goals</span>
        </button>
        <button 
          onClick={() => setActiveTab('meditate')}
          className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'meditate' ? 'bg-accent' : ''}`}
        >
          <Activity size={20} />
          <span className="text-xs mt-1">Meditate</span>
        </button>
        <button 
          onClick={() => setActiveTab('visualize')}
          className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'visualize' ? 'bg-accent' : ''}`}
        >
          <Eye size={20} />
          <span className="text-xs mt-1">Visualize</span>
        </button>
        <button 
          onClick={() => setActiveTab('affirmations')}
          className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'affirmations' ? 'bg-accent' : ''}`}
        >
          <MessageCircle size={20} />
          <span className="text-xs mt-1">Affirmations</span>
        </button>
        {showPrayerTab && (
          <button 
            onClick={() => setActiveTab('prayer')}
            className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'prayer' ? 'bg-accent' : ''}`}
          >
            <Building2 size={20} />
            <span className="text-xs mt-1">Prayer</span>
          </button>
        )}
        <button 
          onClick={() => setActiveTab('gratitude')}
          className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'gratitude' ? 'bg-accent' : ''}`}
        >
          <Heart size={20} />
          <span className="text-xs mt-1">Gratitude</span>
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'analytics' ? 'bg-accent' : ''}`}
        >
          <BarChart2 size={20} />
          <span className="text-xs mt-1">Stats</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'settings' ? 'bg-accent' : ''}`}
        >
          <Settings size={20} />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </nav>
    </div>
  );
}