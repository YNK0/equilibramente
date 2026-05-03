'use client';

import { useCallback, useEffect, useState } from 'react';
import { monitoringService } from '../services/monitoring-service';
import type { WeekData } from '../types';

interface WeeklyReportState {
  week: WeekData | null;
  prevWeekDays: WeekData['days'] | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useWeeklyReport(): WeeklyReportState {
  const [week, setWeek] = useState<WeekData | null>(null);
  const [prevWeekDays, setPrevWeekDays] = useState<WeekData['days'] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const [current, previousRange] = await Promise.all([
        monitoringService.getWeek(),
        monitoringService.getRange(
          new Date(Date.now() - 13 * 86400000).toISOString().split('T')[0],
          new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
        ),
      ]);
      setWeek(current);
      setPrevWeekDays(previousRange.days);
    } catch {
      // Error handled by ErrorBoundary
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { week, prevWeekDays, loading, refresh: fetch };
}
