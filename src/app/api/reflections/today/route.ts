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

  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .eq('user_id', user.id)
    .eq('reflection_date', today)
    .maybeSingle();

  if (error)
    return NextResponse.json(
      { data: null, error: { code: 'DB_ERROR', message: error.message } },
      { status: 500 }
    );

  return NextResponse.json({ data, error: null });
}
