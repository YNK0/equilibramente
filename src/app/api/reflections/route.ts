import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesión para continuar' } }, { status: 401 });

  const body = await request.json();
  const { question_1, question_2, question_3, day_rating } = body;

  const hasAnyAnswer = [question_1, question_2, question_3].some((q) => q?.trim().length > 0) || (day_rating && day_rating > 0);
  if (!hasAnyAnswer) {
    return NextResponse.json({ data: null, error: { code: 'VALIDATION_ERROR', message: 'Responde al menos una pregunta o valora tu día' } }, { status: 400 });
  }

  const today = new Date().toISOString().split('T')[0];

  const { data: existing } = await supabase
    .from('reflections')
    .select('id')
    .eq('user_id', user.id)
    .eq('reflection_date', today)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('reflections')
      .update({ question_1, question_2, question_3, day_rating })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) return NextResponse.json({ data: null, error: { code: 'DB_ERROR', message: error.message } }, { status: 500 });
    return NextResponse.json({ data, error: null });
  }

  const { data, error } = await supabase
    .from('reflections')
    .insert({ question_1, question_2, question_3, day_rating, reflection_date: today, user_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ data: null, error: { code: 'DB_ERROR', message: error.message } }, { status: 500 });

  return NextResponse.json({ data, error: null }, { status: 201 });
}
