'use client';

import { useState, useEffect, useCallback } from 'react';
import { analysisService } from '../services/analysis-service';
import type { AnalysisCurrent, LoadAnalysis } from '../types';

export function useLoadAnalysis() {
  const [analysis, setAnalysis] = useState<AnalysisCurrent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analysisService.getCurrent();
      setAnalysis(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener analisis');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { analysis, loading, error, refetch: fetch };
}
