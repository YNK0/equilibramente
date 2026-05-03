import { type NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type NotifUpdate = Database['public']['Tables']['notification_preferences']['Update'];

const ALLOWED_KEYS = [
  'checkin_reminder',
  'task_reminder',
  'stress_alert',
  'achievement_notify',
  'quiet_hours_start',
  'quiet_hours_end',
];

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

  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

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
  const updates: NotifUpdate = {};

  for (const key of ALLOWED_KEYS) {
    if (key in body) (updates as Record<string, unknown>)[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      {
        data: null,
        error: { code: 'NO_VALID_FIELDS', message: 'No hay campos validos para actualizar' },
      },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('notification_preferences')
    .update(updates)
    .eq('user_id', user.id)
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
