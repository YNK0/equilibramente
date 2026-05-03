import { createClient } from '@/lib/supabase/client';
import type { EmotionalCheckin, CheckinCreateInput, MoodStats, MoodLevel } from '../types';

const supabase = createClient();

export const emotionalService = {
  async createOrUpdate(input: CheckinCreateInput): Promise<EmotionalCheckin> {
    const { data: existing } = await supabase
      .from('emotional_checkins')
      .select('id')
      .gte('created_at', new Date().toISOString().split('T')[0])
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('emotional_checkins')
        .update(input)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const { data, error } = await supabase
      .from('emotional_checkins')
      .insert(input as EmotionalCheckin)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getToday(): Promise<EmotionalCheckin | null> {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('emotional_checkins')
      .select('*')
      .gte('created_at', today)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return data ?? null;
  },

  async list(limit = 30, offset = 0, from?: string, to?: string) {
    let query = supabase
      .from('emotional_checkins')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (from) query = query.gte('created_at', from);
    if (to) query = query.lte('created_at', to);

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data ?? [], count: count ?? 0 };
  },

  async getStats(days = 7): Promise<MoodStats> {
    const to = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - (days - 1) * 86400000).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('emotional_checkins')
      .select('mood, intensity, created_at')
      .gte('created_at', from)
      .lte('created_at', `${to}T23:59:59`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const checkins = data ?? [];
    const distribution: Record<MoodLevel, number> = { great: 0, okay: 0, stressed: 0, overwhelmed: 0 };
    let totalIntensity = 0;

    for (const c of checkins) {
      distribution[c.mood as MoodLevel]++;
      if (c.intensity) totalIntensity += c.intensity;
    }

    const moods = checkins.map(c => c.mood as MoodLevel);
    let trend: MoodStats['mood_trend'] = 'stable';
    if (checkins.length >= 3) {
      const positive = moods.filter(m => m === 'great' || m === 'okay').length;
      const negative = moods.filter(m => m === 'stressed' || m === 'overwhelmed').length;
      const recent = checkins.slice(0, Math.ceil(checkins.length / 2));
      const older = checkins.slice(Math.ceil(checkins.length / 2));
      const recentPositive = recent.filter(m => ['great', 'okay'].includes(m.mood)).length;
      const olderPositive = older.filter(m => ['great', 'okay'].includes(m.mood)).length;
      if (recentPositive > olderPositive) trend = 'improving';
      else if (recentPositive < olderPositive) trend = 'declining';
    }

    return {
      period: { from, to },
      total_checkins: checkins.length,
      mood_distribution: distribution,
      current_streak: 0, // computed by edge function
      avg_intensity: checkins.length > 0 ? totalIntensity / checkins.length : 0,
      most_frequent_mood: getMostFrequent(distribution),
      mood_trend: trend,
    };
  },
};

function getMostFrequent(dist: Record<MoodLevel, number>): MoodLevel | null {
  const entries = Object.entries(dist) as [MoodLevel, number][];
  const max = Math.max(...entries.map(([, v]) => v));
  if (max === 0) return null;
  return entries.find(([, v]) => v === max)?.[0] ?? null;
}
