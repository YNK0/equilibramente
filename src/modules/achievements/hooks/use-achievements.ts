'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { onDataChanged } from '@/modules/analysis/services/analysis-trigger';
import { achievementService } from '../services/achievement-service';
import type { Achievement, AchievementsSummary } from '../types';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [summary, setSummary] = useState<AchievementsSummary>({ unlocked: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']>>(null);

  const fetch = useCallback(async () => {
    const res = await achievementService.getAll();
    setAchievements(res.achievements);
    setSummary(res.summary);
  }, []);

  useEffect(() => {
    fetch().finally(() => setLoading(false));
  }, [fetch]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('achievements-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_achievements' },
        () => { fetch(); }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'streaks' },
        () => { fetch(); }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetch]);

  useEffect(() => {
    return onDataChanged(() => { fetch(); });
  }, [fetch]);

  return { achievements, summary, loading };
}
