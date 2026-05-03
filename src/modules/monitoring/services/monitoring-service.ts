import { createClient } from '@/lib/supabase/client';
import type { LoadLevel, MoodLevel } from '@/types/database';
import type { PendingTask, RangeData, TodayData, WeekData } from '../types';

const supabase = createClient();

async function getUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export const monitoringService = {
  async getToday(): Promise<TodayData> {
    const userId = await getUserId();
    const today = new Date().toISOString().split('T')[0];

    const { data: checkin } = await supabase
      .from('emotional_checkins')
      .select('mood, intensity')
      .eq('user_id', userId)
      .gte('created_at', today)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: tasks } = await supabase.from('tasks').select('status').eq('user_id', userId);

    const allTasks = tasks ?? [];
    const { data: load } = await supabase
      .from('load_analyses')
      .select('load_level, load_score')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: regSessions } = await supabase
      .from('regulation_sessions')
      .select('duration_seconds')
      .eq('user_id', userId)
      .gte('created_at', today);

    const reg = regSessions ?? [];
    const { data: streak } = await supabase
      .from('streaks')
      .select('current_count, longest_count')
      .eq('user_id', userId)
      .eq('type', 'checkin')
      .maybeSingle();

    return {
      date: today,
      checkin: checkin
        ? { mood: checkin.mood as MoodLevel, intensity: checkin.intensity ?? 0 }
        : null,
      tasks: {
        total: allTasks.length,
        completed: allTasks.filter((t) => t.status === 'completed').length,
        pending: allTasks.filter((t) => t.status !== 'completed').length,
      },
      load: { level: (load?.load_level as LoadLevel) ?? null, score: load?.load_score ?? null },
      regulation: {
        sessions: reg.length,
        total_seconds: reg.reduce((sum, s) => sum + (s.duration_seconds ?? 0), 0),
      },
      streak: {
        type: 'checkin',
        current: streak?.current_count ?? 0,
        longest: streak?.longest_count ?? 0,
      },
    };
  },

  async getWeek(): Promise<WeekData> {
    const userId = await getUserId();
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
      .eq('user_id', userId)
      .gte('created_at', from)
      .lte('created_at', `${to}T23:59:59`);

    const { data: tasks } = await supabase
      .from('tasks')
      .select('status, completed_at')
      .eq('user_id', userId);

    const { data: analyses } = await supabase
      .from('load_analyses')
      .select('load_level, created_at')
      .eq('user_id', userId)
      .gte('created_at', from)
      .lte('created_at', `${to}T23:59:59`);

    const days: WeekData['days'] = [];
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

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const tasksCompleted =
        tasks?.filter((t) => t.status === 'completed' && t.completed_at?.startsWith(dateStr))
          .length ?? 0;
      days.push({
        date: dateStr,
        mood: (checkinMap.get(dateStr) as MoodLevel) ?? null,
        tasks_completed: tasksCompleted,
        load_level: (analysisMap.get(dateStr) as LoadLevel) ?? null,
        has_checkin: checkinMap.has(dateStr),
      });
    }

    const moods = days.filter((d) => d.mood).map((d) => d.mood!);
    const moodValues: Record<string, number> = { great: 5, okay: 3.5, stressed: 2, overwhelmed: 1 };
    const avgMood =
      moods.length > 0 ? moods.reduce((sum, m) => sum + (moodValues[m] || 0), 0) / moods.length : 0;

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
    const trend: 'improving' | 'stable' | 'worsening' =
      moods.length < 2
        ? 'stable'
        : secondAvg > firstAvg
          ? 'improving'
          : secondAvg < firstAvg
            ? 'worsening'
            : 'stable';

    const { data: streaks } = await supabase
      .from('streaks')
      .select('type, current_count')
      .eq('user_id', userId);
    const streakData = { checkin: 0, tasks: 0 };
    for (const s of streaks ?? []) {
      if (s.type in streakData) streakData[s.type as keyof typeof streakData] = s.current_count;
    }

    return {
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
    };
  },

  async getPendingTasks(limit = 3): Promise<PendingTask[]> {
    const userId = await getUserId();
    const { data } = await supabase
      .from('tasks')
      .select('id, title, difficulty, due_date, status')
      .eq('user_id', userId)
      .neq('status', 'completed')
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(limit);
    return (data ?? []) as PendingTask[];
  },

  async getRange(from: string, to: string): Promise<RangeData> {
    const userId = await getUserId();
    const { data: checkins } = await supabase
      .from('emotional_checkins')
      .select('mood, created_at')
      .eq('user_id', userId)
      .gte('created_at', from)
      .lte('created_at', `${to}T23:59:59`)
      .order('created_at');

    const dayMap = new Map<string, string>();
    for (const c of checkins ?? []) {
      const d = c.created_at.split('T')[0];
      if (!dayMap.has(d)) dayMap.set(d, c.mood);
    }

    const days: RangeData['days'] = [];
    const start = new Date(from);
    const end = new Date(to);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        mood: (dayMap.get(dateStr) as MoodLevel) ?? null,
        tasks_completed: 0,
        load_level: null,
        has_checkin: dayMap.has(dateStr),
      });
    }

    return { from, to, days };
  },
};
