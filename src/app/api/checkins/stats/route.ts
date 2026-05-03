import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesion para continuar' } }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = Math.min(Number(searchParams.get('days')) || 7, 30);
  const to = new Date().toISOString().split('T')[0];
  const from = new Date(Date.now() - (days - 1) * 86400000).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('emotional_checkins')
    .select('mood, intensity, created_at')
    .eq('user_id', user.id)
    .gte('created_at', from)
    .lte('created_at', `${to}T23:59:59`)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ data: null, error: { code: 'SERVER_ERROR', message: error.message } }, { status: 500 });

  const checkins = data ?? [];
  const distribution: Record<string, number> = { great: 0, okay: 0, stressed: 0, overwhelmed: 0 };
  let totalIntensity = 0;

  for (const c of checkins) {
    distribution[c.mood] = (distribution[c.mood] || 0) + 1;
    if (c.intensity) totalIntensity += c.intensity;
  }

  let trend = 'stable';
  if (checkins.length >= 3) {
    const mid = Math.ceil(checkins.length / 2);
    const recent = checkins.slice(0, mid);
    const older = checkins.slice(mid);
    const recentPos = recent.filter(c => ['great', 'okay'].includes(c.mood)).length;
    const olderPos = older.filter(c => ['great', 'okay'].includes(c.mood)).length;
    if (recentPos > olderPos) trend = 'improving';
    else if (recentPos < olderPos) trend = 'declining';
  }

  const entries = Object.entries(distribution).filter(([, v]) => v > 0);
  const mostFrequent = entries.length > 0 ? entries.reduce((a, b) => a[1] > b[1] ? a : b)[0] : null;

  return NextResponse.json({
    data: {
      period: { from, to },
      total_checkins: checkins.length,
      mood_distribution: distribution,
      current_streak: 0,
      avg_intensity: checkins.length > 0 ? totalIntensity / checkins.length : 0,
      most_frequent_mood: mostFrequent,
      mood_trend: trend,
    },
    error: null,
  });
}
