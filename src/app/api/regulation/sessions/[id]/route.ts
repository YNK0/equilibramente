import { type NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

const MOOD_VALUES: Record<string, number> = { great: 4, okay: 3, stressed: 2, overwhelmed: 1 };

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesión para continuar' } },
      { status: 401 }
    );

  const { id } = await params;
  const body = await req.json();
  const { duration_seconds, mood_after, load_analysis_id } = body;

  if (duration_seconds !== undefined && duration_seconds < 30) {
    await supabase.from('regulation_sessions').delete().eq('id', id).eq('user_id', user.id);
    return NextResponse.json(
      {
        data: null,
        error: { code: 'SESSION_TOO_SHORT', message: 'Sesiones menores a 30s no se guardan' },
      },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from('regulation_sessions')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!existing)
    return NextResponse.json(
      { data: null, error: { code: 'NOT_FOUND', message: 'Sesión no encontrada' } },
      { status: 404 }
    );

  const update: Database['public']['Tables']['regulation_sessions']['Update'] = {};
  if (duration_seconds !== undefined) update.duration_seconds = duration_seconds;
  if (mood_after !== undefined) update.mood_after = mood_after;
  if (load_analysis_id !== undefined) update.load_analysis_id = load_analysis_id;

  const { data, error } = await supabase
    .from('regulation_sessions')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error)
    return NextResponse.json(
      { data: null, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );

  const moodImproved =
    data.mood_before && data.mood_after
      ? (MOOD_VALUES[data.mood_after] ?? 0) > (MOOD_VALUES[data.mood_before] ?? 0)
      : false;

  return NextResponse.json({ data: { ...data, mood_improved: moodImproved }, error: null });
}
