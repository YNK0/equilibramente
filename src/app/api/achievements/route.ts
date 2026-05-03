import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesión para continuar' } }, { status: 401 });

  const [{ data: allAchievements }, { data: userUnlocked }] = await Promise.all([
    supabase.from('achievements').select('*').order('tier', { ascending: true }),
    supabase.from('user_achievements').select('achievement_id, unlocked_at').eq('user_id', user.id),
  ]);

  const unlockedMap = new Map((userUnlocked || []).map((u) => [u.achievement_id, u.unlocked_at]));

  const achievements = (allAchievements || []).map((a) => {
    const unlockedAt = unlockedMap.get(a.id) || null;
    return {
      id: a.id,
      key: a.key,
      title: a.title,
      description: a.description,
      icon: a.icon,
      category: a.category,
      tier: a.tier,
      requirement: a.requirement,
      unlocked: !!unlockedAt,
      unlocked_at: unlockedAt,
      progress: null,
    };
  });

  const unlocked = achievements.filter((a) => a.unlocked).length;

  return NextResponse.json({
    data: achievements,
    summary: { unlocked, total: achievements.length },
    error: null,
  });
}
