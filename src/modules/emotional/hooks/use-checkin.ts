'use client';

import { useCallback, useState } from 'react';
import { isOnline, offlineDB } from '@/lib/offline-db';
import { emotionalService } from '../services/emotional-service';
import type { CheckinCreateInput } from '../types';

export function useCheckin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  const submit = useCallback(async (input: CheckinCreateInput) => {
    setLoading(true);
    setError(null);
    setOffline(false);

    if (!isOnline()) {
      await offlineDB.put('checkins', {
        id: `offline-${Date.now()}`,
        ...input,
        created_at: new Date().toISOString(),
      });
      await offlineDB.addMutation({
        endpoint: '/api/checkins',
        method: 'POST',
        body: input,
      });
      setOffline(true);
      setLoading(false);
      return null;
    }

    try {
      const data = await emotionalService.createOrUpdate(input);
      await offlineDB.put('checkins', data as unknown as Record<string, unknown>);
      return data;
    } catch (e) {
      try {
        await offlineDB.put('checkins', {
          id: `offline-${Date.now()}`,
          ...input,
          created_at: new Date().toISOString(),
        });
        await offlineDB.addMutation({
          endpoint: '/api/checkins',
          method: 'POST',
          body: input,
        });
        setOffline(true);
        setLoading(false);
        return null;
      } catch {
        const msg = e instanceof Error ? e.message : 'Error al guardar check-in';
        setError(msg);
        throw e;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error, offline };
}
