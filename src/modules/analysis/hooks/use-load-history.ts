'use client';

import { useState, useEffect, useCallback } from 'react';
import { analysisService } from '../services/analysis-service';
import type { LoadAnalysis } from '../types';

export function useLoadHistory(days: number = 7) {
  const [data, setData] = useState<LoadAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analysisService.getHistory(days);
      setData(result.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener historial');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
