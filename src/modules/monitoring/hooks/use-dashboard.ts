'use client';

import { useState, useEffect, useCallback } from 'react';
import { monitoringService } from '../services/monitoring-service';
import { createClient } from '@/lib/supabase/client';
import type { TodayData, WeekData, PendingTask } from '../types';
import type { LoadLevel } from '@/types/database';

interface DashboardState {
  today: TodayData | null;
  week: WeekData | null;
  pendingTasks: PendingTask[];
  loading: boolean;
  needsCheckin: boolean;
  refresh: () => Promise<void>;
}

interface AnalysisPayload {
  level: string;
  score: number;
}

export function useDashboard(): DashboardState {
  const [today, setToday] = useState<TodayData | null>(null);
  const [week, setWeek] = useState<WeekData | null>(null);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsCheckin, setNeedsCheckin] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const [todayData, weekData, tasks] = await Promise.all([
        monitoringService.getToday(),
        monitoringService.getWeek(),
        monitoringService.getPendingTasks(),
      ]);
      setToday(todayData);
      setWeek(weekData);
      setPendingTasks(tasks);
      setNeedsCheckin(!todayData.checkin);
    } catch {
      // Error handled by ErrorBoundary
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('dashboard_analysis')
      .on('broadcast', { event: 'analysis_updated' }, (payload) => {
        const p = payload as unknown as AnalysisPayload;
        setToday((prev) => prev ? {
          ...prev,
          load: { level: p.level as LoadLevel, score: p.score },
        } : prev);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { today, week, pendingTasks, loading, needsCheckin, refresh: fetch };
}
