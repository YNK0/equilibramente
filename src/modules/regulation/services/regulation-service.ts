import { createClient } from '@/lib/supabase/client';
import type { RegulationSession, AudioResource, RegulationHistory } from '../types';
import type { Database } from '@/types/database';

const supabase = createClient();

async function getUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export const regulationService = {
  async startSession(type: string, moodBefore?: string | null): Promise<RegulationSession> {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('regulation_sessions')
      .insert({
        type,
        mood_before: moodBefore ?? null,
        duration_seconds: 0,
        user_id: userId,
      } as Database['public']['Tables']['regulation_sessions']['Insert'])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async completeSession(
    id: string,
    durationSeconds: number,
    moodAfter?: string | null,
    loadAnalysisId?: string | null,
  ): Promise<RegulationSession> {
    if (durationSeconds < 30) {
      await supabase.from('regulation_sessions').delete().eq('id', id);
      throw new Error('Sessions under 30 seconds are not saved');
    }
    const { data, error } = await supabase
      .from('regulation_sessions')
      .update({
        duration_seconds: durationSeconds,
        mood_after: moodAfter ?? null,
        load_analysis_id: loadAnalysisId ?? null,
      } as Database['public']['Tables']['regulation_sessions']['Update'])
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async cancelSession(id: string): Promise<void> {
    await supabase.from('regulation_sessions').delete().eq('id', id);
  },

  async getAudios(): Promise<AudioResource[]> {
    const { data, error } = await supabase
      .from('audio_resources')
      .select('*')
      .eq('is_active', true)
      .order('category');
    if (error) throw error;
    return data ?? [];
  },

  async getHistory(days = 30): Promise<RegulationHistory> {
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const { data, error } = await supabase
      .from('regulation_sessions')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false });
    if (error) throw error;

    const sessions = data ?? [];
    let totalSeconds = 0;
    const typeCount: Record<string, number> = {};
    for (const s of sessions) {
      totalSeconds += s.duration_seconds ?? 0;
      typeCount[s.type] = (typeCount[s.type] || 0) + 1;
    }

    let mostUsedType = 'breathing';
    let maxCount = 0;
    for (const [t, c] of Object.entries(typeCount)) {
      if (c > maxCount) { maxCount = c; mostUsedType = t; }
    }

    return {
      data: sessions,
      count: sessions.length,
      total_seconds: totalSeconds,
      most_used_type: mostUsedType,
    };
  },

  getSignedUrl(storagePath: string): Promise<string> {
    return supabase.storage
      .from('audio-resources')
      .createSignedUrl(storagePath, 3600)
      .then(({ data }) => data?.signedUrl ?? '');
  },
};
