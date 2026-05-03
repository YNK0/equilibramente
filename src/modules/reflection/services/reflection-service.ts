import { createClient } from '@/lib/supabase/client';
import type { DailyReflection, ReflectionInput } from '../types';

const supabase = createClient();

export const reflectionService = {
  async getToday(): Promise<DailyReflection | null> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('reflection_date', today)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async save(input: ReflectionInput): Promise<DailyReflection> {
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
      .from('reflections')
      .select('id')
      .eq('reflection_date', today)
      .single();

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
      .insert({ ...input, reflection_date: today } as DailyReflection)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getHistory(limit = 30): Promise<DailyReflection[]> {
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .order('reflection_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },
};
