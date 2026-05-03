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
      .select('load_level, recommendation_ids')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (analysisError) throw analysisError;

    const latest = analyses?.[0];

    if (!latest?.recommendation_ids?.length) {
      return NextResponse.json({
        data: { recommendations: [], load_level: null, generated_at: new Date().toISOString() },
        error: null,
      });
    }

    const { data: recommendations, error: recError } = await supabase
      .from('recommendations')
      .select('*')
      .in('id', latest.recommendation_ids)
      .order('priority', { ascending: false })
      .limit(3);

    if (recError) throw recError;

    return NextResponse.json({
      data: {
        recommendations: recommendations ?? [],
        load_level: latest.load_level,
        generated_at: new Date().toISOString(),
      },
      error: null,
    });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
