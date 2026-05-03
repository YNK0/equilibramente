import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesión para continuar' } }, { status: 401 });

  const today = new Date().toISOString().split('T')[0];

  const { data: checkin } = await supabase
    .from('emotional_checkins')
    .select('mood, intensity')
    .eq('user_id', user.id)
    .gte('created_at', today)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: tasks } = await supabase
    .from('tasks')
    .select('status')
    .eq('user_id', user.id);

  const allTasks = tasks ?? [];

  const { data: load } = await supabase
    .from('load_analyses')
    .select('load_level, load_score')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: regSessions } = await supabase
    .from('regulation_sessions')
    .select('duration_seconds')
    .eq('user_id', user.id)
    .gte('created_at', today);

  const reg = regSessions ?? [];

  const { data: streak } = await supabase
    .from('streaks')
    .select('current_count, longest_count')
    .eq('user_id', user.id)
    .eq('type', 'checkin')
    .maybeSingle();

  return NextResponse.json({
    data: {
      date: today,
      checkin: checkin ? { mood: checkin.mood, intensity: checkin.intensity ?? 0 } : null,
      tasks: {
        total: allTasks.length,
        completed: allTasks.filter((t) => t.status === 'completed').length,
        pending: allTasks.filter((t) => t.status !== 'completed').length,
      },
      load: { level: load?.load_level ?? null, score: load?.load_score ?? null },
      regulation: { sessions: reg.length, total_seconds: reg.reduce((sum, s) => sum + (s.duration_seconds ?? 0), 0) },
      streak: { type: 'checkin', current: streak?.current_count ?? 0, longest: streak?.longest_count ?? 0 },
    },
    error: null,
  });
}
