import { type NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
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
  const { endpoint, keys } = body;

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json(
      {
        data: null,
        error: { code: 'INVALID_SUBSCRIPTION', message: 'Datos de suscripcion invalidos' },
      },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from('notification_preferences')
    .update({ push_subscription: { endpoint, keys } })
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json(
      { data: null, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: { success: true }, error: null });
}

export async function DELETE() {
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

  const { error } = await supabase
    .from('notification_preferences')
    .update({ push_subscription: null })
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json(
      { data: null, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: { success: true }, error: null });
}
