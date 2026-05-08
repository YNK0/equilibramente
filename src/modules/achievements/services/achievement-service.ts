import { createClient } from '@/lib/supabase/client';
import { isGuest } from '@/lib/guest-mode';
import { getGuestStore } from '@/lib/guest-store';
import type { Achievement, AchievementsSummary, Streak } from '../types';

const supabase = createClient();

async function getUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export const achievementService = {
  async getAll(): Promise<{ achievements: Achievement[]; summary: AchievementsSummary }> {
    if (isGuest()) return getGuestStore().getAllAchievements();
    const userId = await getUserId();
    const [{ data: allAchievements }, { data: userUnlocked }] = await Promise.all([
      supabase.from('achievements').select('*').order('tier', { ascending: true }),
      supabase.from('user_achievements').select('achievement_id, unlocked_at').eq('user_id', userId),
    ]);

    const unlockedMap = new Map((userUnlocked || []).map((u) => [u.achievement_id, u.unlocked_at]));

    const achievements: Achievement[] = (allAchievements || []).map((a) => {
      const unlockedAt = unlockedMap.get(a.id) || null;
      return {
        id: a.id,
        key: a.key,
        title: a.title,
        description: a.description,
        icon: a.icon,
        category: a.category,
        tier: a.tier,
        requirement: a.requirement as Record<string, unknown>,
        unlocked: !!unlockedAt,
        unlocked_at: unlockedAt,
        progress: null,
      };
    });

    const unlocked = achievements.filter((a) => a.unlocked).length;

    return { achievements, summary: { unlocked, total: achievements.length } };
  },

  async getStreaks(): Promise<Streak[]> {
    if (isGuest()) return getGuestStore().getStreaks();
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('streaks')
      .select('type, current_count, longest_count, last_activity_date')
      .eq('user_id', userId)
      .order('type');

    if (error) throw error;
    return data ?? [];
  },
};
