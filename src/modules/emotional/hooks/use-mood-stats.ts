'use client';

import { useCallback, useEffect, useState } from 'react';
import { emotionalService } from '../services/emotional-service';
import type { MoodStats } from '../types';

export function useMoodStats(days = 7) {
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await emotionalService.getStats(days);
      setStats(data);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, loading, refetch: fetch };
}
