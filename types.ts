export type Goal = {
    id: string;
    text: string;
    completed: boolean;
    date: string;
    category: 'focus' | 'health' | 'learning';
  };
  
  export type MeditationSession = {
    id: string;
    duration: number;
    date: string;
  };
  
  export interface Visualization {
    id: string;
    description: string;
    date: string;
    timeframe?: string;
    feeling?: string; // Add this
  }

  export type Affirmation = {
    id: string;
    text: string;
    date: string;
    favorite: boolean;
  };

  export type GratitudeEntry = {
    favorite: any;
    id: string;
    text: string;
    date: string;
    category: 'general' | 'people' | 'health' | 'opportunities';
  };

  export interface Prayer {
    id: string;
    name: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
    completed: boolean;
    date: string; // YYYY-MM-DD format
    time?: string; // Actual prayer time
  }

  export interface RPMTask {
    id: string;
    purpose: string;
    desiredOutcome: string;
    massiveActionPlan: string[];
    completed: boolean;
    starred: boolean;
    date: string; // ISO date string
  }