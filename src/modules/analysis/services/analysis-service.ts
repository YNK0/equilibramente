import { createClient } from '@/lib/supabase/client';
import { isGuest } from '@/lib/guest-mode';
import { getGuestStore } from '@/lib/guest-store';
import type { AnalysisCurrent, LoadAnalysis } from '../types';

const supabase = createClient();

async function getUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export const analysisService = {
  async getCurrent(): Promise<AnalysisCurrent> {
    if (isGuest()) return getGuestStore().getCurrentAnalysis();
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('load_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return {
        current: null,
        recommendations: null,
        message: 'Registra tareas y tu estado emocional para ver tu analisis de carga',
      };
    }

    let recommendations = null;
    if (data.recommendation_ids?.length) {
      const { data: recs } = await supabase
        .from('recommendations')
        .select('id, category, title, description, priority')
        .in('id', data.recommendation_ids)
        .order('priority', { ascending: false })
        .limit(3);
      recommendations = recs ?? [];
    }

    return { current: data, recommendations };
  },

  async getHistory(
    days: number = 7,
    from?: string,
    to?: string
  ): Promise<{ data: LoadAnalysis[]; count: number }> {
    if (isGuest()) return getGuestStore().getAnalysisHistory(days, from, to);
    const userId = await getUserId();

    let query = supabase
      .from('load_analyses')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (from) query = query.gte('created_at', from);
    if (to) query = query.lte('created_at', to);
    else if (days) {
      const since = new Date(Date.now() - days * 86400000).toISOString();
      query = query.gte('created_at', since);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data ?? [], count: count ?? 0 };
  },
};
