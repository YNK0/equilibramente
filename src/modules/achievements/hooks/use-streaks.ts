'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { onDataChanged } from '@/modules/analysis/services/analysis-trigger';
import { achievementService } from '../services/achievement-service';
import type { Streak } from '../types';

export function useStreaks() {
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']>>(null);

  const fetch = useCallback(async () => {
    const data = await achievementService.getStreaks();
    setStreaks(data);
  }, []);

  useEffect(() => {
    fetch().finally(() => setLoading(false));
  }, [fetch]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('streaks-realtime')
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

  return { streaks, loading };
}
