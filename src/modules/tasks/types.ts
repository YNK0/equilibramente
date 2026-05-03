import type { Database } from '@/types/database';

export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];
export type Difficulty = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface TaskFormData {
  title: string;
  difficulty: Difficulty | '';
  due_date: string | null;
  estimated_minutes: number | null;
  description: string | null;
}

export interface TaskFilters {
  status: TaskStatus;
  difficulty?: Difficulty;
}

export interface TaskStats {
  pending: { total: number; high: number; medium: number; low: number };
  completed_today: number;
  completed_week: number;
  completion_rate: number;
  urgent_count: number;
}

export interface DifficultyConfig {
  value: Difficulty;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  weight: number;
}
