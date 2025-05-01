import { Heart, Plus } from 'lucide-react';
import { GratitudeEntry } from '../types';

interface GratitudeTrackerProps {
  entries: GratitudeEntry[];
  input: string;
  setInput: (value: string) => void;
  addEntry: (text: string) => void;
  deleteEntry: (id: string) => void;
}

export function GratitudeTracker({
  entries,
  input,
  setInput,
  addEntry,
  deleteEntry
}: GratitudeTrackerProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = entries.filter(entry => entry.date === today);

    function toggleFavorite(id: string): void {
        throw new Error('Function not implemented.');
    }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Gratitude Journal</h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I'm grateful for..."
          className="flex-1 p-2 rounded-lg border"
          onKeyDown={(e) => e.key === 'Enter' && addEntry(input)}
        />
        <button 
          onClick={() => addEntry(input)}
          className="p-2 rounded-lg bg-primary text-primary-foreground"
          disabled={!input.trim()}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {todayEntries.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground rounded-lg border border-dashed">
            Write what you're grateful for today
          </div>
        ) : (
          todayEntries.map(entry => (
            <div 
              key={entry.id} 
              className="p-4 border rounded-lg flex items-center justify-between group"
            >
              <p className="flex-1">✨ {entry.text}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(entry.id)}
                  className={`p-1 ${entry.favorite ? 'text-red-500' : 'text-muted-foreground'}`}
                >
                  <Heart size={18} fill={entry.favorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="p-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                >
                  ×
                </button>
              </div>
            </div>
          ))

        )}
      </div>

      <div className="mt-8">
        <h3 className="font-medium mb-3">Gratitude Prompts</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            "A person who helped me",
            "Something beautiful I saw",
            "A challenge I overcame",
            "A simple pleasure",
            "Something I learned",
            "An opportunity I have"
          ].map((prompt, index) => (
            <button
              key={index}
              onClick={() => addEntry(prompt)}
              className="p-3 border rounded-lg text-sm hover:bg-accent/10 transition-colors text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}