import type { MoodLevel } from '@/modules/emotional/types';
import type { LoadLevel } from '@/modules/analysis/types';

export interface TodayData {
  date: string;
  checkin: { mood: MoodLevel; intensity: number } | null;
  tasks: { total: number; completed: number; pending: number };
  load: { level: LoadLevel | null; score: number | null };
  regulation: { sessions: number; total_seconds: number };
  streak: { type: string; current: number; longest: number };
}

export interface WeekDay {
  date: string;
  mood: MoodLevel | null;
  tasks_completed: number;
  load_level: LoadLevel | null;
  has_checkin: boolean;
}

export interface WeekSummary {
  avg_mood: number;
  total_tasks_completed: number;
  total_regulation_minutes: number;
  streaks: { checkin: number; tasks: number };
  achievements_unlocked: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface WeekData {
  week_start: string;
  week_end: string;
  days: WeekDay[];
  summary: WeekSummary;
}

export interface PendingTask {
  id: string;
  title: string;
  difficulty: string;
  due_date: string | null;
  status: string;
}

export interface RangeData {
  from: string;
  to: string;
  days: WeekDay[];
}
