import { createClient } from '@/lib/supabase/client';
import { isGuest } from '@/lib/guest-mode';
import { getGuestStore } from '@/lib/guest-store';
import type { Json } from '@/types/database';
import type {
  NotificationPrefs,
  NotificationPrefsUpdate,
  Profile,
  ProfileStats,
  ProfileUpdateInput,
  PushSubscriptionJSON,
} from '../types';

export const profileService = {
  async get(): Promise<Profile> {
    if (isGuest()) return getGuestStore().getProfile();
    const supabase = createClient();
    const { data, error } = await supabase.from('profiles').select('*').single();
    if (error) throw error;
    return data;
  },

  async update(input: ProfileUpdateInput): Promise<Profile> {
    if (isGuest()) return getGuestStore().updateProfile(input);
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    const userId = user.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(input)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getNotificationPrefs(): Promise<NotificationPrefs> {
    if (isGuest()) return getGuestStore().getNotificationPrefs();
    const supabase = createClient();
    const { data, error } = await supabase.from('notification_preferences').select('*').single();
    if (error) throw error;
    return data;
  },

  async updateNotificationPrefs(input: NotificationPrefsUpdate): Promise<NotificationPrefs> {
    if (isGuest()) return getGuestStore().updateNotificationPrefs(input);
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    const userId = user.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notification_preferences')
      .update(input)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async subscribePush(subscription: PushSubscriptionJSON): Promise<void> {
    if (isGuest()) { getGuestStore().subscribePush(subscription); return; }
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    const userId = user.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notification_preferences')
      .update({ push_subscription: subscription as unknown as Json })
      .eq('user_id', userId);

    if (error) throw error;
  },

  async unsubscribePush(): Promise<void> {
    if (isGuest()) { getGuestStore().unsubscribePush(); return; }
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    const userId = user.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notification_preferences')
      .update({ push_subscription: null })
      .eq('user_id', userId);

    if (error) throw error;
  },

  async getStats(): Promise<ProfileStats> {
    if (isGuest()) return getGuestStore().getProfileStats();
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    const userId = user.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const [
      { count: totalCheckins },
      { count: totalTasks },
      { data: regulationData },
      { data: achievementsData },
      { data: streakData },
      { data: profileData },
    ] = await Promise.all([
      supabase
        .from('emotional_checkins')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed'),
      supabase.from('regulation_sessions').select('duration_seconds').eq('user_id', userId),
      supabase.from('user_achievements').select('id').eq('user_id', userId),
      supabase
        .from('streaks')
        .select('current_count')
        .eq('user_id', userId)
        .order('current_count', { ascending: false })
        .limit(1),
      supabase.from('profiles').select('created_at').eq('id', userId).single(),
    ]);

    const totalRegulationMinutes = Math.round(
      (regulationData?.reduce((sum, r) => sum + (r.duration_seconds || 0), 0) ?? 0) / 60
    );

    const { count: totalAchievements } = await supabase
      .from('achievements')
      .select('*', { count: 'exact', head: true });

    let totalDays = 0;
    if (profileData?.created_at) {
      totalDays = Math.floor((Date.now() - new Date(profileData.created_at).getTime()) / 86400000);
    }

    return {
      total_days: totalDays,
      total_checkins: totalCheckins ?? 0,
      total_tasks_completed: totalTasks ?? 0,
      total_regulation_minutes: totalRegulationMinutes,
      achievements_unlocked: achievementsData?.length ?? 0,
      achievements_total: totalAchievements ?? 0,
      longest_streak: streakData?.[0]?.current_count ?? 0,
    };
  },

  async uploadAvatar(file: File): Promise<string> {
    if (isGuest()) return getGuestStore().uploadAvatar(file);
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    const userId = user.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, cacheControl: '3600' });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);

    await supabase.from('profiles').update({ avatar_url: urlData.publicUrl }).eq('id', userId);

    return urlData.publicUrl;
  },
};
