import type { Database } from '@/types/database';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type NotificationPrefs = Database['public']['Tables']['notification_preferences']['Row'];

export interface ProfileUpdateInput {
  display_name?: string;
  streak_hour?: string | null;
}

export interface NotificationPrefsUpdate {
  checkin_reminder?: boolean;
  task_reminder?: boolean;
  stress_alert?: boolean;
  achievement_notify?: boolean;
  quiet_hours_start?: string | null;
  quiet_hours_end?: string | null;
}

export interface PushSubscriptionJSON {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface ProfileStats {
  total_days: number;
  total_checkins: number;
  total_tasks_completed: number;
  total_regulation_minutes: number;
  achievements_unlocked: number;
  achievements_total: number;
  longest_streak: number;
}
