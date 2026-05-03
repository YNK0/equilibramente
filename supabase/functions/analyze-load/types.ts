// Shared types for the analyze-load Edge Function
// Matches frontend types from src/modules/analysis/types.ts

export type LoadLevel = 'low' | 'moderate' | 'high' | 'critical';
export type Difficulty = 'low' | 'medium' | 'high';
export type MoodLevel = 'great' | 'okay' | 'stressed' | 'overwhelmed';

export interface Task {
  id: string;
  difficulty: Difficulty;
  status: string;
  due_date: string | null;
}

export interface EmotionalCheckin {
  id: string;
  mood: MoodLevel;
}

export interface LoadResult {
  score: number;
  level: LoadLevel;
  taskLoad: number;
  urgencyBonus: number;
  moodModifier: number;
  highDifficultyCount: number;
  upcomingDeadlinesCount: number;
}

export interface TriggerCondition {
  load_level?: LoadLevel[];
  min_difficulty_tasks?: number;
  mood_in?: MoodLevel[];
  time_of_day?: ('morning' | 'afternoon' | 'evening')[];
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  trigger_condition: TriggerCondition;
  priority: number;
  is_active: boolean;
}
