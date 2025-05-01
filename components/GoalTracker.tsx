import { Check, Plus, Trash } from 'lucide-react'; // Added Trash icon
import { Goal } from '../types';

interface GoalTrackerProps {
  goals: Goal[];
  input: string;
  setInput: (value: string) => void;
  addGoal: () => void;
  toggleGoal: (id: string) => void;
  deleteGoal: (id: string) => void; // New prop
}

export function GoalTracker({ 
  goals, 
  input, 
  setInput, 
  addGoal, 
  toggleGoal,
  deleteGoal 
}: GoalTrackerProps) {
  const todayGoals = goals.filter(g => g.date === new Date().toISOString().split('T')[0]);

  return (
    <div>
      {/* Add Goal Section */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add goal (e.g. 'No social media')"
          className="flex-1 p-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent"
          onKeyDown={(e) => e.key === 'Enter' && addGoal()}
        />
        <button 
          onClick={addGoal}
          className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          disabled={!input.trim()} // Disable when empty
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Goals List */}
      {todayGoals.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No goals for today. Add one above!
        </div>
      ) : (
        <ul className="space-y-2">
          {todayGoals.map(goal => (
            <li 
              key={goal.id} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/10 group"
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                    goal.completed 
                      ? 'bg-primary border-primary' 
                      : 'border-border hover:border-primary'
                  }`}
                  aria-label={goal.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {goal.completed && <Check size={16} className="text-white" />}
                </button>
                <span className={`flex-1 ${goal.completed ? 'line-through opacity-70' : ''}`}>
                  {goal.text}
                </span>
              </div>
              
              <button
                onClick={() => deleteGoal(goal.id)}
                className="p-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                aria-label="Delete goal"
              >
                <Trash size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}