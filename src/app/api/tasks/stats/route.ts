import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesion para continuar' } },
      { status: 401 }
    );

  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  const { data: tasks } = await supabase
    .from('tasks')
    .select('status, difficulty, completed_at, due_date')
    .eq('user_id', user.id);

  const all = tasks ?? [];
  const pending = all.filter((t) => t.status === 'pending');
  const completed = all.filter((t) => t.status === 'completed');
  const completedToday = completed.filter((t) => t.completed_at?.startsWith(today)).length;
  const completedWeek = completed.filter((t) => t.completed_at && t.completed_at >= weekAgo).length;
  const urgent = pending.filter((t) => {
    if (!t.due_date) return false;
    return Math.ceil((new Date(t.due_date).getTime() - Date.now()) / 86400000) <= 1;
  }).length;

  const total = all.filter((t) => t.status !== 'cancelled').length;
  const rate = total > 0 ? completed.length / total : 0;

  return NextResponse.json({
    data: {
      pending: {
        total: pending.length,
        high: pending.filter((t) => t.difficulty === 'high').length,
        medium: pending.filter((t) => t.difficulty === 'medium').length,
        low: pending.filter((t) => t.difficulty === 'low').length,
      },
      completed_today: completedToday,
      completed_week: completedWeek,
      completion_rate: Math.round(rate * 100) / 100,
      urgent_count: urgent,
    },
    error: null,
  });
}
