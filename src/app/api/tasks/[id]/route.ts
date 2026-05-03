import { type NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesion para continuar' } },
      { status: 401 }
    );

  const { id } = await params;
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (error)
    return NextResponse.json(
      { data: null, error: { code: 'NOT_FOUND', message: 'Tarea no encontrada' } },
      { status: 404 }
    );
  return NextResponse.json({ data, error: null });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesion para continuar' } },
      { status: 401 }
    );

  const { id } = await params;
  const body = await req.json();
  const { title, description, difficulty, due_date, estimated_minutes, status } = body;

  const updateData: Database['public']['Tables']['tasks']['Update'] = {
    updated_at: new Date().toISOString(),
  };
  if (title !== undefined) updateData.title = title.trim();
  if (description !== undefined) updateData.description = description?.trim() || null;
  if (difficulty !== undefined) updateData.difficulty = difficulty;
  if (due_date !== undefined) updateData.due_date = due_date || null;
  if (estimated_minutes !== undefined) updateData.estimated_minutes = estimated_minutes || null;
  if (status !== undefined) {
    updateData.status = status;
    if (status === 'completed') updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error)
    return NextResponse.json(
      { data: null, error: { code: 'NOT_FOUND', message: 'Tarea no encontrada' } },
      { status: 404 }
    );
  return NextResponse.json({ data, error: null });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesion para continuar' } },
      { status: 401 }
    );

  const { id } = await params;
  const { error } = await supabase.from('tasks').delete().eq('id', id).eq('user_id', user.id);
  if (error)
    return NextResponse.json(
      { data: null, error: { code: 'NOT_FOUND', message: 'Tarea no encontrada' } },
      { status: 404 }
    );
  return NextResponse.json({ data: null, error: null });
}
