export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  tier: number;
  requirement: Record<string, unknown>;
  unlocked: boolean;
  unlocked_at: string | null;
  progress: { current: number; required: number } | null;
}

export interface Streak {
  type: string;
  current_count: number;
  longest_count: number;
  last_activity_date: string | null;
}

export interface AchievementsSummary {
  unlocked: number;
  total: number;
}
