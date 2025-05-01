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
  
  export type Visualization = {
    id: string;
    description: string;
    date: string;
  };

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