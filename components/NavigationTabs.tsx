import { Check, Activity, Eye, BarChart2, MessageCircle, Heart } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: 'goals' | 'meditate' | 'visualize' | 'analytics' | 'affirmations' | 'gratitude') => void;
}

export function NavigationTabs({ activeTab, setActiveTab }: NavigationTabsProps) {
  return (
    <div className="overflow-x-auto">
      <nav className="flex gap-3 mb-6 w-[400px]">
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
      </nav>
    </div>
  );
}