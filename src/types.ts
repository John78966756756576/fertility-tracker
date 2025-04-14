export interface CycleDay {
  date: string;
  flow: 'light' | 'medium' | 'heavy' | null;
  symptoms: string[];
  mood: string | null;
  notes: string;
}

export interface User {
  cycleLength: number;
  periodLength: number;
  lastPeriodStart: string;
  pregnancyMode: boolean;
  cycles: CycleDay[];
}

export interface Symptom {
  id: string;
  name: string;
  category: 'physical' | 'emotional' | 'other';
  icon: string;
}