'use client';

import { useCallback, useState } from 'react';
import { regulationService } from '../services/regulation-service';
import type { RegulationSession } from '../types';

interface UseRegulationSessionResult {
  session: RegulationSession | null;
  isStarting: boolean;
  isCompleting: boolean;
  startSession: (type: string, moodBefore?: string | null) => Promise<RegulationSession>;
  completeSession: (
    durationSeconds: number,
    moodAfter?: string | null,
    loadAnalysisId?: string | null
  ) => Promise<void>;
  cancelSession: () => Promise<void>;
}

export function useRegulationSession(): UseRegulationSessionResult {
  const [session, setSession] = useState<RegulationSession | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const startSession = useCallback(async (type: string, moodBefore?: string | null) => {
    setIsStarting(true);
    try {
      const s = await regulationService.startSession(type, moodBefore);
      setSession(s);
      return s;
    } finally {
      setIsStarting(false);
    }
  }, []);

  const completeSession = useCallback(
    async (durationSeconds: number, moodAfter?: string | null, loadAnalysisId?: string | null) => {
      if (!session) return;
      setIsCompleting(true);
      try {
        if (durationSeconds < 30) {
          await regulationService.cancelSession(session.id);
          setSession(null);
          return;
        }
        await regulationService.completeSession(
          session.id,
          durationSeconds,
          moodAfter,
          loadAnalysisId
        );
      } finally {
        setIsCompleting(false);
      }
    },
    [session]
  );

  const cancelSession = useCallback(async () => {
    if (!session) return;
    await regulationService.cancelSession(session.id);
    setSession(null);
  }, [session]);

  return { session, isStarting, isCompleting, startSession, completeSession, cancelSession };
}
