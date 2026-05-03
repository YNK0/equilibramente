import { type NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesion para continuar' } },
      { status: 401 }
    );
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (error) {
    return NextResponse.json(
      { data: null, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data, error: null });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesion para continuar' } },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { display_name, streak_hour } = body;

  if (display_name !== undefined && !display_name.trim()) {
    return NextResponse.json(
      { data: null, error: { code: 'INVALID_NAME', message: 'El nombre no puede estar vacio' } },
      { status: 400 }
    );
  }

  const updates: ProfileUpdate = {};
  if (display_name !== undefined) updates.display_name = display_name.trim();
  if (streak_hour !== undefined) updates.streak_hour = streak_hour;

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { data: null, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data, error: null });
}
