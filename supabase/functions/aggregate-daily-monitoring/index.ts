// Supabase Edge Function: aggregate-daily-monitoring
//
// Trigger: cron job daily at 23:55 UTC
// Flow: for each active user → compute daily stats → upsert daily_monitoring

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface DailyStats {
  user_id: string;
  date: string;
  avg_mood: number | null;
  tasks_completed: number;
  tasks_total: number;
  regulation_sessions_count: number;
  regulation_total_seconds: number;
  stress_level_avg: number | null;
}

const MOOD_VALUES: Record<string, number> = {
  great: 5,
  okay: 3.5,
  stressed: 2,
  overwhelmed: 1,
};

serve(async (_req: Request) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const today = new Date().toISOString().split('T')[0];

    // Get all users active today (had check-in or task activity)
    const { data: activeUsers, error: userError } = await supabase
      .from('profiles')
      .select('id');

    if (userError) throw userError;
    if (!activeUsers) {
      return new Response(JSON.stringify({ message: 'No users found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stats: DailyStats[] = [];

    for (const user of activeUsers) {
      const userId = user.id;

      // Today's check-ins
      const { data: checkins } = await supabase
        .from('emotional_checkins')
        .select('mood')
        .eq('user_id', userId)
        .gte('created_at', today)
        .lte('created_at', `${today}T23:59:59`);

      // Today's tasks
      const { count: tasksCompleted } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed')
        .gte('updated_at', today);

      const { count: tasksTotal } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Today's regulation sessions
      const { data: sessions } = await supabase
        .from('regulation_sessions')
        .select('duration_seconds')
        .eq('user_id', userId)
        .gte('created_at', today);

      // Today's load analysis
      const { data: analysis } = await supabase
        .from('load_analyses')
        .select('load_score')
        .eq('user_id', userId)
        .gte('created_at', today)
        .order('created_at', { ascending: false })
        .limit(1);

      // Compute averages
      let avgMood: number | null = null;
      if (checkins && checkins.length > 0) {
        const moodSum = checkins.reduce((sum, c) => sum + (MOOD_VALUES[c.mood] || 0), 0);
        avgMood = Math.round((moodSum / checkins.length) * 100) / 100;
      }

      const regulationSeconds = sessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) ?? 0;

      stats.push({
        user_id: userId,
        date: today,
        avg_mood: avgMood,
        tasks_completed: tasksCompleted ?? 0,
        tasks_total: tasksTotal ?? 0,
        regulation_sessions_count: sessions?.length ?? 0,
        regulation_total_seconds: regulationSeconds,
        stress_level_avg: analysis?.[0]?.load_score ?? null,
      });
    }

    // Upsert daily monitoring records
    for (const stat of stats) {
      const { error } = await supabase
        .from('daily_monitoring')
        .upsert(stat, { onConflict: 'user_id,date' });

      if (error) {
        console.error(`Failed to upsert monitoring for user ${stat.user_id}:`, error.message);
      }
    }

    return new Response(
      JSON.stringify({ message: `Aggregated ${stats.length} user daily summaries for ${today}` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('aggregate-daily-monitoring error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
