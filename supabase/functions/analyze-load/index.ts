// Supabase Edge Function: analyze-load
//
// Trigger: called after checkin created/updated, task created/updated/completed/deleted,
//          or via cron job every 3 hours (8am-11pm)
//
// Flow: fetch user data → compute load → match recommendations → store → notify

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { calculateLoad } from './calculator.ts';
import { matchRecommendations } from './matcher.ts';
import { notifyUser } from './notifier.ts';
import type { Task, EmotionalCheckin, Recommendation } from './types.ts';

const THROTTLE_MS = 5 * 60 * 1000; // 5 minutes between analyses
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req: Request) => {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Missing user_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // 1. Throttle check
    const { data: lastAnalysis } = await supabase
      .from('load_analyses')
      .select('created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastAnalysis) {
      const elapsed = Date.now() - new Date(lastAnalysis.created_at).getTime();
      if (elapsed < THROTTLE_MS) {
        return new Response(
          JSON.stringify({ skipped: true, reason: 'throttle' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // 2. Fetch pending tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('id, difficulty, status, due_date')
      .eq('user_id', user_id)
      .in('status', ['pending', 'in_progress']);

    if (tasksError) throw tasksError;

    // 3. Fetch last checkin
    const { data: checkins } = await supabase
      .from('emotional_checkins')
      .select('id, mood, created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1);

    const lastCheckin = checkins?.[0] ?? null;

    // 4. Skip if no data
    if (!tasks?.length && !lastCheckin) {
      return new Response(
        JSON.stringify({ skipped: true, reason: 'no_data' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Calculate load
    const result = calculateLoad(tasks as Task[] ?? [], lastCheckin as EmotionalCheckin | null);

    // 6. Fetch active recommendations from catalog
    const { data: recommendations, error: recError } = await supabase
      .from('recommendations')
      .select('*')
      .eq('is_active', true);

    if (recError) throw recError;

    // 7. Match recommendations
    const matches = matchRecommendations(
      result,
      (recommendations as Recommendation[]) ?? [],
      lastCheckin?.mood ?? null
    );

    // 8. Store analysis
    const { data: analysis, error: insertError } = await supabase
      .from('load_analyses')
      .insert({
        user_id,
        load_level: result.level,
        load_score: result.score,
        task_count: (tasks ?? []).length,
        high_difficulty_count: result.highDifficultyCount,
        upcoming_deadlines_count: result.upcomingDeadlinesCount,
        last_mood: lastCheckin?.mood ?? null,
        recommendation_ids: matches.map((r) => r.id),
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // 9. Log recommendations
    if (matches.length > 0) {
      await supabase
        .from('recommendation_logs')
        .insert(
          matches.map((rec) => ({
            user_id,
            recommendation_id: rec.id,
            load_analysis_id: analysis.id,
          }))
        );
    }

    // 10. Notify
    await notifyUser(supabase, user_id, result, matches);

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[analyze-load] Error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
