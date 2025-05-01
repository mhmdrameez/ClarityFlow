import { Eye, Plus, Trash2 } from 'lucide-react';
import { Visualization } from '../types';

interface VisualizationTrackerProps {
  visualizations: Visualization[];
  input: string;
  setInput: (value: string) => void;
  addVisualization: (desc: string) => void;
  deleteVisualization: (id: string) => void; // New prop
}

export function VisualizationTracker({ 
  visualizations, 
  input, 
  setInput, 
  addVisualization,
  deleteVisualization 
}: VisualizationTrackerProps) {
  const todayVisualizations = visualizations
    .filter(viz => viz.date === new Date().toISOString().split('T')[0])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Eye className="text-primary" size={20} />
        Visualization Journal
      </h2>
      
      {/* Input Section */}
      <div className="space-y-2">
        <textarea 
          value={input}
          placeholder="Describe your vision or goal in detail..."
          className="w-full p-3 border rounded-lg min-h-[120px] focus:ring-2 focus:ring-primary focus:border-transparent"
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          onClick={() => {
            if (input.trim()) {
              addVisualization(input);
              setInput('');
            }
          }}
          className={`w-full p-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
            input.trim() 
              ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!input.trim()}
        >
          <Plus size={16} />
          Record Visualization
        </button>
      </div>

      {/* Visualization List */}
      <div className="mt-6">
        <h3 className="font-medium flex items-center justify-between">
          <span>Your Visualizations</span>
          <span className="text-sm text-muted-foreground">
            {todayVisualizations.length} today
          </span>
        </h3>
        
        {todayVisualizations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground rounded-lg border border-dashed mt-2">
            No visualizations recorded today
          </div>
        ) : (
          <div className="space-y-3 mt-3">
            {todayVisualizations.map(viz => (
              <div 
                key={viz.id} 
                className="p-4 border rounded-lg hover:bg-accent/10 transition-colors group relative"
              >
                <p className="whitespace-pre-line">{viz.description}</p>
                <button
                  onClick={() => deleteVisualization(viz.id)}
                  className="absolute top-2 right-2 p-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                  aria-label="Delete visualization"
                >
                  <Trash2 size={16} />
                </button>
                <div className="text-xs text-muted-foreground mt-2">
                  {new Date(viz.date).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}