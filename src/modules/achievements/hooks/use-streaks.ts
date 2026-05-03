'use client';

import { useEffect, useState } from 'react';
import { achievementService } from '../services/achievement-service';
import type { Streak } from '../types';

export function useStreaks() {
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    achievementService
      .getStreaks()
      .then(setStreaks)
      .finally(() => setLoading(false));
  }, []);

  return { streaks, loading };
}
