'use client';

import { useState, useCallback } from 'react';
import { PauseExercise } from './pause-exercise';
import { MoodComparison } from './mood-comparison';
import { useRegulationSession } from '../hooks/use-regulation-session';
import { ACTIVE_PAUSE_SEQUENCE } from '../constants';

export function ActivePause() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const { startSession, completeSession } = useRegulationSession();
  const startTimeRef = { current: 0 };

  const handleStart = useCallback(async () => {
    await startSession('active_pause');
    startTimeRef.current = Date.now();
    setStarted(true);
  }, [startSession]);

  const handleExerciseComplete = useCallback(() => {
    if (step < ACTIVE_PAUSE_SEQUENCE.length - 1) {
      setStep((s) => s + 1);
    } else {
      setCompleted(true);
    }
  }, [step]);

  const handleComplete = useCallback(async (moodAfter: string | null) => {
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    setElapsedSeconds(elapsed);
    await completeSession(elapsed, moodAfter);
  }, [completeSession]);

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center">
          <span className="text-4xl">⏸️</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Pausa Activa</h2>
        <p className="text-sm text-gray-500 text-center">
          {ACTIVE_PAUSE_SEQUENCE.length} ejercicios rápidos para despejarte
        </p>
        <button
          onClick={handleStart}
          className="px-8 py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
        >
          Empezar
        </button>
      </div>
    );
  }

  if (completed) {
    return <MoodComparison before={null} after={null} onAfterChange={handleComplete} />;
  }

  const exercise = ACTIVE_PAUSE_SEQUENCE[step];

  return (
    <div>
      <PauseExercise
        key={step}
        exercise={exercise}
        onComplete={handleExerciseComplete}
        onSkip={handleExerciseComplete}
      />
      <p className="text-center text-xs text-gray-400">
        {step + 1} de {ACTIVE_PAUSE_SEQUENCE.length}
      </p>
    </div>
  );
}
