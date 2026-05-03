import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesión para continuar' } },
      { status: 401 }
    );

  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const from = monday.toISOString().split('T')[0];
  const to = sunday.toISOString().split('T')[0];

  const { data: checkins } = await supabase
    .from('emotional_checkins')
    .select('mood, created_at')
    .eq('user_id', user.id)
    .gte('created_at', from)
    .lte('created_at', `${to}T23:59:59`);

  const { data: tasks } = await supabase
    .from('tasks')
    .select('status, completed_at')
    .eq('user_id', user.id);

  const { data: analyses } = await supabase
    .from('load_analyses')
    .select('load_level, created_at')
    .eq('user_id', user.id)
    .gte('created_at', from)
    .lte('created_at', `${to}T23:59:59`);

  const checkinMap = new Map<string, string>();
  for (const c of checkins ?? []) {
    const d = c.created_at.split('T')[0];
    if (!checkinMap.has(d)) checkinMap.set(d, c.mood);
  }

  const analysisMap = new Map<string, string>();
  for (const a of analyses ?? []) {
    const d = a.created_at.split('T')[0];
    analysisMap.set(d, a.load_level);
  }

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const tasksCompleted =
      tasks?.filter((t) => t.status === 'completed' && t.completed_at?.startsWith(dateStr))
        .length ?? 0;
    days.push({
      date: dateStr,
      mood: checkinMap.get(dateStr) ?? null,
      tasks_completed: tasksCompleted,
      load_level: analysisMap.get(dateStr) ?? null,
      has_checkin: checkinMap.has(dateStr),
    });
  }

  const moods = days.filter((d) => d.mood).map((d) => d.mood!);
  const moodValues = { great: 5, okay: 3.5, stressed: 2, overwhelmed: 1 } as Record<string, number>;
  const avgMood =
    moods.length > 0 ? moods.reduce((sum, m) => sum + (moodValues[m] || 0), 0) / moods.length : 0;

  const { data: streaks } = await supabase
    .from('streaks')
    .select('type, current_count')
    .eq('user_id', user.id);

  const streakData = { checkin: 0, tasks: 0 };
  for (const s of streaks ?? []) {
    if (s.type in streakData) streakData[s.type as keyof typeof streakData] = s.current_count;
  }

  // Compute trend
  const firstHalf = moods.slice(0, Math.ceil(moods.length / 2));
  const secondHalf = moods.slice(Math.ceil(moods.length / 2));
  const firstAvg =
    firstHalf.length > 0
      ? firstHalf.reduce((s, m) => s + (moodValues[m] || 0), 0) / firstHalf.length
      : 0;
  const secondAvg =
    secondHalf.length > 0
      ? secondHalf.reduce((s, m) => s + (moodValues[m] || 0), 0) / secondHalf.length
      : 0;
  const trend =
    moods.length < 2
      ? 'stable'
      : secondAvg > firstAvg
        ? 'improving'
        : secondAvg < firstAvg
          ? 'worsening'
          : 'stable';

  return NextResponse.json({
    data: {
      week_start: from,
      week_end: to,
      days,
      summary: {
        avg_mood: parseFloat(avgMood.toFixed(1)),
        total_tasks_completed: tasks?.filter((t) => t.status === 'completed').length ?? 0,
        total_regulation_minutes: 0,
        streaks: streakData,
        achievements_unlocked: 0,
        trend,
      },
    },
    error: null,
  });
}
