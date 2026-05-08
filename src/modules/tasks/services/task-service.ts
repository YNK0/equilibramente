import { createClient } from '@/lib/supabase/client';
import { isGuest } from '@/lib/guest-mode';
import { getGuestStore } from '@/lib/guest-store';
import type { Task, TaskFilters, TaskInsert, TaskStats, TaskUpdate } from '../types';

const supabase = createClient();

async function getUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export const taskService = {
  async list(filters: TaskFilters, limit = 20, offset = 0) {
    if (isGuest()) return getGuestStore().listTasks(filters, limit, offset);
    const userId = await getUserId();

    let query = supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
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
    if (isGuest()) return getGuestStore().createTask(input);
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...input, user_id: userId, status: input.status || 'pending' })
      .select()
      .single();
    if (error) throw error;

    // Fire-and-forget: check achievements (first task, etc.)
    const rpc = supabase.rpc as (fn: string, args?: Record<string, unknown>) => PromiseLike<unknown>;
    void (async () => {
      try {
        await rpc('check_achievements', { p_user_id: userId });
      } catch { /* non-critical */ }
    })();

    return data;
  },

  async getById(id: string): Promise<Task> {
    if (isGuest()) return getGuestStore().getTaskById(id);
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, input: TaskUpdate): Promise<Task> {
    if (isGuest()) return getGuestStore().updateTask(id, input);
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async complete(id: string): Promise<Task> {
    if (isGuest()) return getGuestStore().completeTask(id);
    const userId = await getUserId();
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('tasks')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;

    // Fire-and-forget: update streak + check achievements
    const rpc = supabase.rpc as (fn: string, args?: Record<string, unknown>) => PromiseLike<unknown>;
    void (async () => {
      try {
        await rpc('update_streak', {
          p_user_id: userId,
          p_type: 'task_completion',
          p_activity_date: today,
        });
        await rpc('check_achievements', { p_user_id: userId });
      } catch { /* non-critical */ }
    })();

    return data;
  },

  async remove(id: string): Promise<void> {
    if (isGuest()) { getGuestStore().removeTask(id); return; }
    const userId = await getUserId();
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;
  },

  async getStats(): Promise<TaskStats> {
    if (isGuest()) return getGuestStore().getTaskStats();
    const userId = await getUserId();
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    const { data: all } = await supabase
      .from('tasks')
      .select('status, difficulty, completed_at, due_date')
      .eq('user_id', userId);

    const tasks = all ?? [];
    const pending = tasks.filter((t) => t.status === 'pending');
    const completed = tasks.filter((t) => t.status === 'completed');
    const completedToday = completed.filter((t) => t.completed_at?.startsWith(today)).length;
    const completedWeek = completed.filter(
      (t) => t.completed_at && t.completed_at >= weekAgo
    ).length;
    const urgentCount = pending.filter((t) => {
      if (!t.due_date) return false;
      const days = Math.ceil((new Date(t.due_date).getTime() - Date.now()) / 86400000);
      return days <= 1;
    }).length;

    const total = tasks.filter((t) => t.status !== 'cancelled').length;
    const completionRate = total > 0 ? completed.length / total : 0;

    return {
      pending: {
        total: pending.length,
        high: pending.filter((t) => t.difficulty === 'high').length,
        medium: pending.filter((t) => t.difficulty === 'medium').length,
        low: pending.filter((t) => t.difficulty === 'low').length,
      },
      completed_today: completedToday,
      completed_week: completedWeek,
      completion_rate: Math.round(completionRate * 100) / 100,
      urgent_count: urgentCount,
    };
  },
};
