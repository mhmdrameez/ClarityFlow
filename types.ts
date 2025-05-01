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