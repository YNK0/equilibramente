export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          key: string
          requirement: Json
          tier: number
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon: string
          id?: string
          key: string
          requirement?: Json
          tier?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          key?: string
          requirement?: Json
          tier?: number
          title?: string
        }
        Relationships: []
      }
      audio_resources: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration_seconds: number
          id: string
          is_active: boolean
          storage_path: string
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          duration_seconds: number
          id?: string
          is_active?: boolean
          storage_path: string
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number
          id?: string
          is_active?: boolean
          storage_path?: string
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      daily_monitoring: {
        Row: {
          avg_mood: number | null
          created_at: string
          date: string
          id: string
          regulation_sessions_count: number
          regulation_total_seconds: number
          stress_level_avg: number | null
          tasks_completed: number
          tasks_total: number
          user_id: string
        }
        Insert: {
          avg_mood?: number | null
          created_at?: string
          date?: string
          id?: string
          regulation_sessions_count?: number
          regulation_total_seconds?: number
          stress_level_avg?: number | null
          tasks_completed?: number
          tasks_total?: number
          user_id: string
        }
        Update: {
          avg_mood?: number | null
          created_at?: string
          date?: string
          id?: string
          regulation_sessions_count?: number
          regulation_total_seconds?: number
          stress_level_avg?: number | null
          tasks_completed?: number
          tasks_total?: number
          user_id?: string
        }
        Relationships: []
      }
      emotional_checkins: {
        Row: {
          created_at: string
          id: string
          intensity: number | null
          mood: string
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          intensity?: number | null
          mood: string
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          intensity?: number | null
          mood?: string
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      load_analyses: {
        Row: {
          created_at: string
          high_difficulty_count: number
          id: string
          last_mood: string | null
          load_level: string
          load_score: number
          recommendation_ids: string[] | null
          task_count: number
          upcoming_deadlines_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          high_difficulty_count?: number
          id?: string
          last_mood?: string | null
          load_level: string
          load_score?: number
          recommendation_ids?: string[] | null
          task_count?: number
          upcoming_deadlines_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          high_difficulty_count?: number
          id?: string
          last_mood?: string | null
          load_level?: string
          load_score?: number
          recommendation_ids?: string[] | null
          task_count?: number
          upcoming_deadlines_count?: number
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          achievement_notify: boolean
          checkin_reminder: boolean
          created_at: string
          id: string
          push_subscription: Json | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          stress_alert: boolean
          task_reminder: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_notify?: boolean
          checkin_reminder?: boolean
          created_at?: string
          id?: string
          push_subscription?: Json | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          stress_alert?: boolean
          task_reminder?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_notify?: boolean
          checkin_reminder?: boolean
          created_at?: string
          id?: string
          push_subscription?: Json | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          stress_alert?: boolean
          task_reminder?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          onboarding_completed: boolean
          streak_hour: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          id: string
          onboarding_completed?: boolean
          streak_hour?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          onboarding_completed?: boolean
          streak_hour?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recommendation_logs: {
        Row: {
          action_taken: string | null
          created_at: string
          id: string
          load_analysis_id: string | null
          recommendation_id: string
          user_id: string
          was_helpful: boolean | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string
          id?: string
          load_analysis_id?: string | null
          recommendation_id: string
          user_id: string
          was_helpful?: boolean | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string
          id?: string
          load_analysis_id?: string | null
          recommendation_id?: string
          user_id?: string
          was_helpful?: boolean | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          priority: number
          title: string
          trigger_condition: Json
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          priority?: number
          title: string
          trigger_condition?: Json
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          priority?: number
          title?: string
          trigger_condition?: Json
        }
        Relationships: []
      }
      reflections: {
        Row: {
          created_at: string
          day_rating: number | null
          id: string
          question_1: string | null
          question_2: string | null
          question_3: string | null
          reflection_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_rating?: number | null
          id?: string
          question_1?: string | null
          question_2?: string | null
          question_3?: string | null
          reflection_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_rating?: number | null
          id?: string
          question_1?: string | null
          question_2?: string | null
          question_3?: string | null
          reflection_date?: string
          user_id?: string
        }
        Relationships: []
      }
      regulation_sessions: {
        Row: {
          created_at: string
          duration_seconds: number
          id: string
          load_analysis_id: string | null
          mood_after: string | null
          mood_before: string | null
          resource_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds: number
          id?: string
          load_analysis_id?: string | null
          mood_after?: string | null
          mood_before?: string | null
          resource_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number
          id?: string
          load_analysis_id?: string | null
          mood_after?: string | null
          mood_before?: string | null
          resource_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      streaks: {
        Row: {
          current_count: number
          id: string
          last_activity_date: string | null
          longest_count: number
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          current_count?: number
          id?: string
          last_activity_date?: string | null
          longest_count?: number
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          current_count?: number
          id?: string
          last_activity_date?: string | null
          longest_count?: number
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          difficulty: string
          due_date: string | null
          estimated_minutes: number | null
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          due_date?: string | null
          estimated_minutes?: number | null
          id?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          due_date?: string | null
          estimated_minutes?: number | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          notified: boolean
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          notified?: boolean
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          notified?: boolean
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      check_broken_streaks: { Args: Record<string, never>; Returns: undefined }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  TableName extends keyof DefaultSchema['Tables'] & keyof DefaultSchema['Views'],
> = (DefaultSchema['Tables'] & DefaultSchema['Views'])[TableName] extends { Row: infer R } ? R : never

export type TablesInsert<
  TableName extends keyof DefaultSchema['Tables'],
> = DefaultSchema['Tables'][TableName] extends { Insert: infer I } ? I : never

export type TablesUpdate<
  TableName extends keyof DefaultSchema['Tables'],
> = DefaultSchema['Tables'][TableName] extends { Update: infer U } ? U : never

export type Enums<
  EnumName extends keyof DefaultSchema['Enums'],
> = DefaultSchema['Enums'][EnumName]

// UI config types
export interface MoodConfig {
  value: MoodLevel;
  emoji: string;
  label: string;
  color: string;
}

export interface LoadLevelConfig {
  value: LoadLevel;
  label: string;
  color: string;
  icon: string;
}

// Enums
export type MoodLevel = 'great' | 'okay' | 'stressed' | 'overwhelmed';
export type Difficulty = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type LoadLevel = 'low' | 'moderate' | 'high' | 'critical';
export type RegulationType = 'breathing' | 'audio' | 'active_pause' | 'motivation';
export type RecommendationCategory = 'task_management' | 'emotional' | 'pause' | 'focus';
export type AchievementCategory = 'streak' | 'emotional' | 'tasks' | 'regulation' | 'reflection';
export type StreakType = 'checkin' | 'task_completion' | 'reflection' | 'regulation';

// Core entities (mirrors DB schema)
export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  onboarding_completed: boolean;
  streak_hour: string;
  created_at: string;
  updated_at: string;
}

export interface EmotionalCheckin {
  id: string;
  user_id: string;
  mood: MoodLevel;
  intensity: number | null;
  note: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  due_date: string | null;
  estimated_minutes: number | null;
  status: TaskStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoadAnalysis {
  id: string;
  user_id: string;
  load_level: LoadLevel;
  task_count: number;
  high_difficulty_count: number;
  upcoming_deadlines_count: number;
  last_mood: MoodLevel | null;
  recommendation_ids: string[] | null;
  created_at: string;
}

export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  title: string;
  description: string;
  trigger_condition: Record<string, unknown>;
  priority: number;
  is_active: boolean;
}

export interface RegulationSession {
  id: string;
  user_id: string;
  type: RegulationType;
  duration_seconds: number;
  resource_id: string | null;
  mood_before: MoodLevel | null;
  mood_after: MoodLevel | null;
  load_analysis_id: string | null;
  created_at: string;
}

export interface DailyMonitoring {
  id: string;
  user_id: string;
  date: string;
  avg_mood: number | null;
  tasks_total: number;
  tasks_completed: number;
  stress_level_avg: number | null;
  regulation_sessions_count: number;
  regulation_total_seconds: number;
}

export interface Reflection {
  id: string;
  user_id: string;
  question_1: string | null;
  question_2: string | null;
  question_3: string | null;
  day_rating: number | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: Record<string, unknown>;
  tier: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  notified: boolean;
}

export interface Streak {
  id: string;
  user_id: string;
  type: StreakType;
  current_count: number;
  longest_count: number;
  last_activity_date: string | null;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  push_subscription: unknown | null;
  checkin_reminder: boolean;
  task_reminder: boolean;
  stress_alert: boolean;
  achievement_notify: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
}

// API types
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  page_size: number;
  error: null;
}

// UI state
export interface AsyncState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}
