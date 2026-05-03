import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesion para continuar' } }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'pending';
  const difficulty = searchParams.get('difficulty');
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);
  const offset = Number(searchParams.get('offset')) || 0;

  let query = supabase
    .from('tasks')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .eq('status', status)
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (difficulty) query = query.eq('difficulty', difficulty);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ data: null, error: { code: 'SERVER_ERROR', message: error.message } }, { status: 500 });

  return NextResponse.json({ data: data ?? [], count: count ?? 0, page: Math.floor(offset / limit) + 1, page_size: limit, error: null });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesion para continuar' } }, { status: 401 });

  const body = await req.json();
  const { title, description, difficulty, due_date, estimated_minutes } = body;

  const errors: Record<string, string> = {};
  if (!title || !title.trim()) errors.title = 'Escribe un titulo para la tarea';
  else if (title.length > 200) errors.title = 'El titulo debe tener maximo 200 caracteres';
  if (!difficulty || !['low', 'medium', 'high'].includes(difficulty)) errors.difficulty = 'Selecciona la dificultad';
  if (description && description.length > 500) errors.description = 'La descripcion debe tener maximo 500 caracteres';
  if (estimated_minutes && estimated_minutes < 5) errors.estimated_minutes = 'El tiempo minimo es 5 minutos';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ data: null, error: { code: 'VALIDATION_ERROR', message: 'Datos invalidos', details: errors } }, { status: 400 });
  }

  // Check max pending tasks
  const { count } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'pending');

  if (count && count >= 50) {
    return NextResponse.json({ data: null, error: { code: 'MAX_TASKS', message: 'Tienes mas de 50 tareas pendientes. Completa o cancela algunas.' } }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      title: title.trim(),
      description: description?.trim() || null,
      difficulty,
      due_date: due_date || null,
      estimated_minutes: estimated_minutes || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ data: null, error: { code: 'SERVER_ERROR', message: error.message } }, { status: 500 });
  return NextResponse.json({ data, error: null }, { status: 201 });
}
