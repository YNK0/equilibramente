import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: analyses, error: analysisError } = await supabase
      .from('load_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (analysisError) throw analysisError;

    const current = analyses?.[0] ?? null;

    if (!current) {
      return NextResponse.json({
        data: {
          current: null,
          message: 'Registra tareas y tu estado emocional para ver tu analisis de carga',
        },
        error: null,
      });
    }

    let recommendations = null;
    if (current.recommendation_ids?.length) {
      const { data: recs } = await supabase
        .from('recommendations')
        .select('id, category, title, description, priority')
        .in('id', current.recommendation_ids)
        .order('priority', { ascending: false })
        .limit(3);
      recommendations = recs ?? [];
    }

    return NextResponse.json({ data: { current, recommendations }, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
