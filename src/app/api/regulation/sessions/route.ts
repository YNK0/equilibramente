import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesión para continuar' } }, { status: 401 });

  const body = await req.json();
  const { type, mood_before } = body;

  if (!type || !['breathing', 'audio', 'active_pause'].includes(type)) {
    return NextResponse.json({ data: null, error: { code: 'INVALID_TYPE', message: 'Tipo de regulación inválido' } }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('regulation_sessions')
    .insert({ type, mood_before: mood_before ?? null, duration_seconds: 0, user_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ data: null, error: { code: 'SERVER_ERROR', message: error.message } }, { status: 500 });
  return NextResponse.json({ data, error: null }, { status: 201 });
}
