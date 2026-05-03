'use client';

import { useCallback, useEffect, useState } from 'react';
import { recommendationService } from '../services/recommendation-service';
import type { RecommendationsResponse } from '../types';

export function useRecommendations() {
  const [data, setData] = useState<RecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await recommendationService.getCurrent();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener recomendaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const dismiss = useCallback((recId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        recommendations: prev.recommendations.filter((r) => r.id !== recId),
      };
    });
  }, []);

  const sendFeedback = useCallback(
    async (
      recommendationId: string,
      loadAnalysisId: string,
      actionTaken: string | null,
      wasHelpful: boolean | null
    ) => {
      try {
        await recommendationService.sendFeedback(
          recommendationId,
          loadAnalysisId,
          actionTaken,
          wasHelpful
        );
      } catch {
        // silently fail on feedback
      }
    },
    []
  );

  return {
    recommendations: data?.recommendations ?? [],
    loadLevel: data?.load_level ?? null,
    loading,
    error,
    refetch: fetch,
    dismiss,
    sendFeedback,
  };
}
