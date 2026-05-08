import { createClient } from '@/lib/supabase/client';
import { isGuest } from '@/lib/guest-mode';
import { getGuestStore } from '@/lib/guest-store';
import type { LoadLevel } from '@/modules/analysis/types';
import type { RecommendationsResponse } from '../types';

const supabase = createClient();

async function getUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? '';
}

export const recommendationService = {
  async getCurrent(): Promise<RecommendationsResponse> {
    if (isGuest()) return getGuestStore().getCurrentRecommendations();
    const { data: analyses, error: analysisError } = await supabase
      .from('load_analyses')
      .select('load_level, recommendation_ids')
      .order('created_at', { ascending: false })
      .limit(1);

    if (analysisError) throw analysisError;

    const latest = analyses?.[0];
    if (!latest?.recommendation_ids?.length) {
      return { recommendations: [], load_level: null, generated_at: new Date().toISOString() };
    }

    const { data: recommendations, error: recError } = await supabase
      .from('recommendations')
      .select('*')
      .in('id', latest.recommendation_ids)
      .order('priority', { ascending: false })
      .limit(3);

    if (recError) throw recError;

    return {
      recommendations: recommendations ?? [],
      load_level: (latest.load_level as LoadLevel) ?? null,
      generated_at: new Date().toISOString(),
    };
  },

  async sendFeedback(
    recommendationId: string,
    loadAnalysisId: string,
    actionTaken: string | null,
    wasHelpful: boolean | null
  ): Promise<void> {
    if (isGuest()) { getGuestStore().sendRecommendationFeedback(recommendationId, loadAnalysisId, actionTaken, wasHelpful); return; }
    const userId = await getUserId();
    if (!userId) throw new Error('Not authenticated');

    const { data: existing } = await supabase
      .from('recommendation_logs')
      .select('id')
      .eq('recommendation_id', recommendationId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('recommendation_logs')
        .update({ action_taken: actionTaken, was_helpful: wasHelpful })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('recommendation_logs').insert({
        user_id: userId,
        recommendation_id: recommendationId,
        load_analysis_id: loadAnalysisId,
        action_taken: actionTaken,
        was_helpful: wasHelpful,
      });
      if (error) throw error;
    }
  },
};
