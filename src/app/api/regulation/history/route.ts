import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesión para continuar' } }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = Math.min(Number(searchParams.get('days')) || 30, 90);

  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await supabase
    .from('regulation_sessions')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', since)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ data: null, error: { code: 'SERVER_ERROR', message: error.message } }, { status: 500 });

  const sessions = data ?? [];
  let totalSeconds = 0;
  const typeCount: Record<string, number> = {};
  for (const s of sessions) {
    totalSeconds += s.duration_seconds ?? 0;
    typeCount[s.type] = (typeCount[s.type] || 0) + 1;
  }

  let mostUsedType = 'breathing';
  let maxCount = 0;
  for (const [t, c] of Object.entries(typeCount)) {
    if (c > maxCount) { maxCount = c; mostUsedType = t; }
  }

  return NextResponse.json({
    data: sessions,
    count: sessions.length,
    total_seconds: totalSeconds,
    most_used_type: mostUsedType,
    error: null,
  });
}
