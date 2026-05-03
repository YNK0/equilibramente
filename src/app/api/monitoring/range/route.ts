import { type NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesión para continuar' } },
      { status: 401 }
    );

  const { searchParams } = new URL(req.url);
  const from =
    searchParams.get('from') || new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const to = searchParams.get('to') || new Date().toISOString().split('T')[0];

  const { data: checkins } = await supabase
    .from('emotional_checkins')
    .select('mood, created_at')
    .eq('user_id', user.id)
    .gte('created_at', from)
    .lte('created_at', `${to}T23:59:59`)
    .order('created_at');

  const checkinMap = new Map<string, string>();
  for (const c of checkins ?? []) {
    const d = c.created_at.split('T')[0];
    if (!checkinMap.has(d)) checkinMap.set(d, c.mood);
  }

  const days = [];
  const start = new Date(from);
  const end = new Date(to);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      mood: checkinMap.get(dateStr) ?? null,
      tasks_completed: 0,
      load_level: null,
      has_checkin: checkinMap.has(dateStr),
    });
  }

  return NextResponse.json({ data: { from, to, days }, error: null });
}
