import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesion para continuar' } }, { status: 401 });

  const { id } = await params;
  const { data, error } = await supabase
    .from('tasks')
    .update({ status: 'completed', completed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ data: null, error: { code: 'NOT_FOUND', message: 'Tarea no encontrada' } }, { status: 404 });
  return NextResponse.json({ data, error: null });
}
