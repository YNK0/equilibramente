import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { calculateLoad } from '@/modules/analysis/utils/load-calculator';

const STALE_MS = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check latest analysis
    const { data: analyses } = await supabase
      .from('load_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const latest = analyses?.[0] ?? null;
    const isStale =
      !latest ||
      Date.now() - new Date(latest.created_at).getTime() > STALE_MS;

    if (!isStale) {
      // Return cached analysis with its recommendations
      let recommendations = null;
      if (latest.recommendation_ids?.length) {
        const { data: recs } = await supabase
          .from('recommendations')
          .select('id, category, title, description, priority')
          .in('id', latest.recommendation_ids)
          .order('priority', { ascending: false })
          .limit(3);
        recommendations = recs ?? [];
      }
      return NextResponse.json({ data: { current: latest, recommendations }, error: null });
    }

    // Compute fresh analysis
    const { data: tasks } = await supabase
      .from('tasks')
      .select('difficulty, status, due_date')
      .eq('user_id', user.id)
      .in('status', ['pending', 'in_progress']);

    const { data: checkins } = await supabase
      .from('emotional_checkins')
      .select('mood')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!tasks?.length && !checkins?.length) {
      return NextResponse.json({
        data: {
          current: null,
          message: 'Registra tareas y tu estado emocional para ver tu analisis de carga',
        },
        error: null,
      });
    }

    const result = calculateLoad({
      tasks: (tasks ?? []).map((t) => ({
        difficulty: t.difficulty as 'low' | 'medium' | 'high',
        status: t.status,
        due_date: t.due_date,
      })),
      lastCheckin: checkins?.[0] ?? null,
    });

    // Match recommendations from catalog
    const { data: allRecs } = await supabase
      .from('recommendations')
      .select('*')
      .eq('is_active', true);

    const now = new Date();
    const hour = now.getHours();
    const period: 'morning' | 'afternoon' | 'evening' =
      hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

    const matched = (allRecs ?? [])
      .filter((rec) => {
        const trigger = rec.trigger_condition as Record<string, unknown>;
        if (trigger.load_level && Array.isArray(trigger.load_level) && !(trigger.load_level as string[]).includes(result.level)) return false;
        if (typeof trigger.min_difficulty_tasks === 'number' && result.highDifficultyCount < (trigger.min_difficulty_tasks as number)) return false;
        if (trigger.mood_in && Array.isArray(trigger.mood_in) && (!checkins?.[0]?.mood || !(trigger.mood_in as string[]).includes(checkins[0].mood))) return false;
        if (trigger.time_of_day && Array.isArray(trigger.time_of_day) && !(trigger.time_of_day as string[]).includes(period)) return false;
        return true;
      })
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);

    const matchedIds = matched.map((r) => r.id);

    // Store analysis
    const { data: analysis, error: insertError } = await supabase
      .from('load_analyses')
      .insert({
        user_id: user.id,
        load_level: result.level,
        load_score: result.score,
        task_count: (tasks ?? []).length,
        high_difficulty_count: result.highDifficultyCount,
        upcoming_deadlines_count: result.upcomingDeadlinesCount,
        last_mood: checkins?.[0]?.mood ?? null,
        recommendation_ids: matchedIds,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Log recommendations
    if (matched.length > 0) {
      await supabase.from('recommendation_logs').insert(
        matched.map((rec) => ({
          user_id: user.id,
          recommendation_id: rec.id,
          load_analysis_id: analysis.id,
        }))
      );
    }

    const recommendations = matched.map((r) => ({
      id: r.id,
      category: r.category,
      title: r.title,
      description: r.description,
      priority: r.priority,
    }));

    return NextResponse.json({ data: { current: analysis, recommendations }, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
