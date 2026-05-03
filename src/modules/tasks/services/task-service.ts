import { createClient } from '@/lib/supabase/client';
import type { Task, TaskInsert, TaskUpdate, TaskFilters, TaskStats, Difficulty } from '../types';

const supabase = createClient();

export const taskService = {
  async list(filters: TaskFilters, limit = 20, offset = 0) {
    let query = supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('status', filters.status)
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters.difficulty) query = query.eq('difficulty', filters.difficulty);

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data ?? [], count: count ?? 0 };
  },

  async create(input: TaskInsert): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...input, status: input.status || 'pending' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, input: TaskUpdate): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async complete(id: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: 'completed', completed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },

  async getStats(): Promise<TaskStats> {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    const { data: all } = await supabase.from('tasks').select('status, difficulty, completed_at, due_date');

    const tasks = all ?? [];
    const pending = tasks.filter(t => t.status === 'pending');
    const completed = tasks.filter(t => t.status === 'completed');
    const completedToday = completed.filter(t => t.completed_at?.startsWith(today)).length;
    const completedWeek = completed.filter(t => t.completed_at && t.completed_at >= weekAgo).length;
    const urgentCount = pending.filter(t => {
      if (!t.due_date) return false;
      const days = Math.ceil((new Date(t.due_date).getTime() - Date.now()) / 86400000);
      return days <= 1;
    }).length;

    const total = tasks.filter(t => t.status !== 'cancelled').length;
    const completionRate = total > 0 ? completed.length / total : 0;

    return {
      pending: {
        total: pending.length,
        high: pending.filter(t => t.difficulty === 'high').length,
        medium: pending.filter(t => t.difficulty === 'medium').length,
        low: pending.filter(t => t.difficulty === 'low').length,
      },
      completed_today: completedToday,
      completed_week: completedWeek,
      completion_rate: Math.round(completionRate * 100) / 100,
      urgent_count: urgentCount,
    };
  },
};
