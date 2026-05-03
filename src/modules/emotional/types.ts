import type { Database } from '@/types/database';

export type MoodLevel = 'great' | 'okay' | 'stressed' | 'overwhelmed';
export type EmotionalCheckin = Database['public']['Tables']['emotional_checkins']['Row'];
export type CheckinCreateInput = {
  mood: MoodLevel;
  intensity?: number | null;
  note?: string | null;
};

export interface MoodConfig {
  value: MoodLevel;
  emoji: string;
  label: string;
  color: string;
}

export interface MoodResponse {
  message: string;
  gradient: string;
}

export interface MoodStats {
  period: { from: string; to: string };
  total_checkins: number;
  mood_distribution: Record<string, number>;
  current_streak: number;
  avg_intensity: number;
  most_frequent_mood: string | null;
  mood_trend: 'improving' | 'declining' | 'stable';
}
