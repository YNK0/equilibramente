'use client';

import { useState, useCallback } from 'react';
import { emotionalService } from '../services/emotional-service';
import type { CheckinCreateInput } from '../types';

export function useCheckin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (input: CheckinCreateInput) => {
    setLoading(true);
    setError(null);
    try {
      const data = await emotionalService.createOrUpdate(input);
      return data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al guardar check-in';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error };
}
