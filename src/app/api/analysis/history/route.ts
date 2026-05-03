import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') ?? '7', 10);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    let query = supabase
      .from('load_analyses')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (from) query = query.gte('created_at', from);
    if (to) query = query.lte('created_at', to);
    else {
      const since = new Date(Date.now() - days * 86400000).toISOString();
      query = query.gte('created_at', since);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data: data ?? [], count: count ?? 0, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: [], error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
