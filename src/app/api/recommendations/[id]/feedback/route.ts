import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { load_analysis_id, action_taken, was_helpful } = body;

    const { data: existing } = await supabase
      .from('recommendation_logs')
      .select('id')
      .eq('recommendation_id', id)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('recommendation_logs')
        .update({ action_taken, was_helpful })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('recommendation_logs')
        .insert({
          user_id: user.id,
          recommendation_id: id,
          load_analysis_id: load_analysis_id ?? null,
          action_taken: action_taken ?? null,
          was_helpful: was_helpful ?? null,
        });
      if (error) throw error;
    }

    return NextResponse.json({ data: { id, updated: true }, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
