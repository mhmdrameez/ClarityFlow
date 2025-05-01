import { Check, Activity, Eye, BarChart2 } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: 'goals' | 'meditate' | 'visualize' | 'analytics') => void;
}

export function NavigationTabs({ activeTab, setActiveTab }: NavigationTabsProps) {
  return (
    <nav className="grid grid-cols-4 gap-2 mb-6">
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
        onClick={() => setActiveTab('analytics')}
        className={`p-2 rounded-lg flex flex-col items-center ${activeTab === 'analytics' ? 'bg-accent' : ''}`}
      >
        <BarChart2 size={20} />
        <span className="text-xs mt-1">Stats</span>
      </button>
    </nav>
  );
}