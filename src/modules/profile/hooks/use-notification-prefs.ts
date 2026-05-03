'use client';

import { useCallback, useEffect, useState } from 'react';
import { profileService } from '../services/profile-service';
import type { NotificationPrefs, NotificationPrefsUpdate } from '../types';

export function useNotificationPrefs() {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getNotificationPrefs();
      setPrefs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const update = useCallback(async (input: NotificationPrefsUpdate) => {
    const updated = await profileService.updateNotificationPrefs(input);
    setPrefs(updated);
    return updated;
  }, []);

  return { prefs, loading, error, update, refetch: fetch };
}
