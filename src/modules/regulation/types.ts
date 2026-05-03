import type { Database } from '@/types/database';

export type RegulationType = 'breathing' | 'audio' | 'active_pause';
export type BreathingPatternKey = '4-7-8' | 'box' | 'simple';

export type RegulationSession = Database['public']['Tables']['regulation_sessions']['Row'];
export type AudioResource = Database['public']['Tables']['audio_resources']['Row'];

export interface BreathingPhase {
  name: string;
  label: string;
  duration: number;
  color: string;
  scale: number;
}

export interface BreathingPattern {
  name: string;
  description: string;
  cycles: number;
  phases: BreathingPhase[];
}

export interface ActivePauseExercise {
  title: string;
  duration: number;
  instruction: string;
  illustration: string;
}

export interface MoodComparisonData {
  before: string | null;
  after: string | null;
  improved: boolean;
}

export interface RegulationHistory {
  data: RegulationSession[];
  count: number;
  total_seconds: number;
  most_used_type: string;
}
