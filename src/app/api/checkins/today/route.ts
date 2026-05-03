import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesion para continuar' } },
      { status: 401 }
    );

  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('emotional_checkins')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', today)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: 'NO_CHECKIN_TODAY',
          message: 'Aun no has registrado tu estado emocional hoy',
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ data, error: null });
}
