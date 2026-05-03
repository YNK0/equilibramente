import { type NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesion para continuar' } },
      { status: 401 }
    );

  const body = await req.json();
  const { mood, intensity, note } = body;

  if (!mood || !['great', 'okay', 'stressed', 'overwhelmed'].includes(mood)) {
    return NextResponse.json(
      {
        data: null,
        error: { code: 'INVALID_MOOD', message: 'Selecciona como te sientes para continuar' },
      },
      { status: 400 }
    );
  }
  if (intensity && (intensity < 1 || intensity > 5)) {
    return NextResponse.json(
      {
        data: null,
        error: { code: 'INVALID_INTENSITY', message: 'La intensidad debe ser del 1 al 5' },
      },
      { status: 400 }
    );
  }
  if (note && note.length > 140) {
    return NextResponse.json(
      {
        data: null,
        error: { code: 'NOTE_TOO_LONG', message: 'La nota debe tener maximo 140 caracteres' },
      },
      { status: 400 }
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const { data: existing } = await supabase
    .from('emotional_checkins')
    .select('id')
    .eq('user_id', user.id)
    .gte('created_at', today)
    .maybeSingle();

  const payload = {
    mood,
    intensity: intensity ?? null,
    note: note?.trim() || null,
    user_id: user.id,
  };

  let result;
  let statusCode: number;

  if (existing) {
    const { data, error: updateError } = await supabase
      .from('emotional_checkins')
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single();
    if (updateError)
      return NextResponse.json(
        { data: null, error: { code: 'SERVER_ERROR', message: updateError.message } },
        { status: 500 }
      );
    result = { data, error: { code: 'CHECKIN_UPDATED', message: 'Check-in actualizado' } };
    statusCode = 200;
  } else {
    const { data, error: insertError } = await supabase
      .from('emotional_checkins')
      .insert(payload)
      .select()
      .single();
    if (insertError)
      return NextResponse.json(
        { data: null, error: { code: 'SERVER_ERROR', message: insertError.message } },
        { status: 500 }
      );

    // Update check-in streak (fire-and-forget, non-critical)
    void (async () => {
      try {
        const rpc = supabase.rpc as (fn: string, args?: Record<string, unknown>) => PromiseLike<unknown>;
        await rpc('update_streak', { p_user_id: user.id, p_type: 'checkin', p_activity_date: today });
      } catch { /* non-critical */ }
    })();

    result = { data, error: null };
    statusCode = 201;
  }

  return NextResponse.json(result, { status: statusCode });
}

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesion para continuar' } },
      { status: 401 }
    );

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get('limit')) || 30, 90);
  const offset = Number(searchParams.get('offset')) || 0;
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  let query = supabase
    .from('emotional_checkins')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (from) query = query.gte('created_at', from);
  if (to) query = query.lte('created_at', to);

  const { data, count, error } = await query;
  if (error)
    return NextResponse.json(
      { data: null, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );

  return NextResponse.json({
    data: data ?? [],
    count: count ?? 0,
    page: Math.floor(offset / limit) + 1,
    page_size: limit,
    error: null,
  });
}
