import { createClient } from '@/lib/supabase/client';
import { isGuest } from '@/lib/guest-mode';
import { getGuestStore } from '@/lib/guest-store';
import type { DailyReflection, ReflectionInput } from '../types';

const supabase = createClient();

async function getUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export const reflectionService = {
  async getToday(): Promise<DailyReflection | null> {
    if (isGuest()) return getGuestStore().getTodayReflection();
    const userId = await getUserId();
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', userId)
      .eq('reflection_date', today)
      .maybeSingle();

    if (error) throw error;
    return data ?? null;
  },

  async save(input: ReflectionInput): Promise<DailyReflection> {
    if (isGuest()) return getGuestStore().saveReflection(input);
    const userId = await getUserId();
    const today = new Date().toISOString().split('T')[0];

    const { data: existing } = await supabase
      .from('reflections')
      .select('id')
      .eq('user_id', userId)
      .eq('reflection_date', today)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('reflections')
        .update(input)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const { data, error } = await supabase
      .from('reflections')
      .insert({ ...input, user_id: userId, reflection_date: today })
      .select()
      .single();
    if (error) throw error;

    // Fire-and-forget: update streak + check achievements
    const rpc = supabase.rpc as (fn: string, args?: Record<string, unknown>) => PromiseLike<unknown>;
    void (async () => {
      try {
        await rpc('update_streak', {
          p_user_id: userId,
          p_type: 'reflection',
          p_activity_date: today,
        });
        await rpc('check_achievements', { p_user_id: userId });
      } catch { /* non-critical */ }
    })();

    return data;
  },

  async getHistory(limit = 30): Promise<DailyReflection[]> {
    if (isGuest()) return getGuestStore().getReflectionHistory(limit);
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', userId)
      .order('reflection_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  },
};
