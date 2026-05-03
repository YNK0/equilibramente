import type { MoodLevel } from '@/modules/emotional/types';

export const MOOD_TO_NUMBER: Record<MoodLevel, number> = {
  great: 5,
  okay: 3.5,
  stressed: 2,
  overwhelmed: 1,
};

export const NUMBER_TO_MOOD: Record<number, MoodLevel> = {
  5: 'great',
  3.5: 'okay',
  2: 'stressed',
  1: 'overwhelmed',
} as Record<number, MoodLevel>;

export const LOAD_TO_NUMBER: Record<string, number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export const MOOD_COLORS: Record<MoodLevel, string> = {
  great: '#22c55e',
  okay: '#3b82f6',
  stressed: '#f59e0b',
  overwhelmed: '#ef4444',
};
