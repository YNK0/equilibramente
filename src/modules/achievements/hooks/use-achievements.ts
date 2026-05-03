'use client';

import { useState, useEffect } from 'react';
import { achievementService } from '../services/achievement-service';
import type { Achievement, AchievementsSummary } from '../types';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [summary, setSummary] = useState<AchievementsSummary>({ unlocked: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    achievementService.getAll()
      .then((res) => {
        setAchievements(res.achievements);
        setSummary(res.summary);
      })
      .finally(() => setLoading(false));
  }, []);

  return { achievements, summary, loading };
}
