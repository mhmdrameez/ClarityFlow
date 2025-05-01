import { Heart, Plus } from 'lucide-react';
import { Affirmation } from '../types';

interface AffirmationsTrackerProps {
  affirmations: Affirmation[];
  input: string;
  setInput: (value: string) => void;
  addAffirmation: (text: string) => void;
  deleteAffirmation: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

export function AffirmationsTracker({
  affirmations,
  input,
  setInput,
  addAffirmation,
  deleteAffirmation,
  toggleFavorite
}: AffirmationsTrackerProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayAffirmations = affirmations.filter(a => a.date === today);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Daily Affirmations</h2>
      
      {/* Add Affirmation */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a positive affirmation..."
          className="flex-1 p-2 rounded-lg border"
          onKeyDown={(e) => e.key === 'Enter' && addAffirmation(input)}
        />
        <button 
          onClick={() => addAffirmation(input)}
          className="p-2 rounded-lg bg-primary text-primary-foreground"
          disabled={!input.trim()}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Affirmations List */}
      <div className="space-y-3">
        {todayAffirmations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground rounded-lg border border-dashed">
            No affirmations today. Add some positive statements!
          </div>
        ) : (
          todayAffirmations.map(affirmation => (
            <div 
              key={affirmation.id} 
              className="p-4 border rounded-lg flex items-center justify-between group"
            >
              <p className="flex-1">{affirmation.text}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(affirmation.id)}
                  className={`p-1 ${affirmation.favorite ? 'text-red-500' : 'text-muted-foreground'}`}
                >
                  <Heart size={18} fill={affirmation.favorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => deleteAffirmation(affirmation.id)}
                  className="p-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Suggested Affirmations */}
      <div className="mt-8">
        <h3 className="font-medium mb-3">Suggested Affirmations</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            "I am capable of amazing things",
            "I choose to be happy today",
            "I am worthy of love and respect",
            "Challenges help me grow",
            "I attract positive energy",
            "My potential is limitless"
          ].map((text, index) => (
            <button
              key={index}
              onClick={() => addAffirmation(text)}
              className="p-3 border rounded-lg text-sm hover:bg-accent/10 transition-colors text-left"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}