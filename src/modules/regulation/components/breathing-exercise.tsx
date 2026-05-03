'use client';

import { useState, useCallback } from 'react';
import { useBreathing } from '../hooks/use-breathing';
import { BreathingCircle } from './breathing-circle';
import { MoodComparison } from './mood-comparison';
import { useRegulationSession } from '../hooks/use-regulation-session';
import { BREATHING_PATTERNS } from '../constants';
import type { BreathingPatternKey } from '../types';

interface Props {
  pattern?: BreathingPatternKey;
  loadAnalysisId?: string | null;
  onComplete?: () => void;
}

export function BreathingExercise({ pattern: initialPattern = '4-7-8', loadAnalysisId = null, onComplete }: Props) {
  const [patternKey, setPatternKey] = useState<BreathingPatternKey>(initialPattern);
  const [showPrep, setShowPrep] = useState(true);
  const [moodBefore, setMoodBefore] = useState<string | null>(null);
  const [moodAfter, setMoodAfter] = useState<string | null>(null);

  const { phase, cycle, totalCycles, progress, overallProgress, isActive, isPaused, isCompleted, elapsedSeconds, start, pause, resume, stop } = useBreathing(patternKey);
  const { session, startSession, completeSession } = useRegulationSession();

  const pattern = BREATHING_PATTERNS[patternKey];

  const handleStart = useCallback(async () => {
    await startSession('breathing', moodBefore);
    setShowPrep(false);
    start();
  }, [startSession, moodBefore, start]);

  const handleComplete = useCallback(async (after: string | null) => {
    setMoodAfter(after);
    await completeSession(Math.round(elapsedSeconds), after, loadAnalysisId);
    onComplete?.();
  }, [completeSession, elapsedSeconds, loadAnalysisId, onComplete]);

  if (isCompleted) {
    return <MoodComparison before={moodBefore} after={moodAfter} onAfterChange={handleComplete} />;
  }

  if (showPrep) {
    return (
      <div className="flex flex-col items-center gap-6 p-6">
        <BreathingCircle phase={{ name: 'idle', label: '🌬️', duration: 0, color: '#7c3aed', scale: 1 }} progress={0} />
        <h2 className="text-xl font-semibold text-purple-900">{pattern.name}</h2>
        <p className="text-sm text-gray-500 text-center">{pattern.description}</p>

        <div className="flex gap-2 w-full max-w-xs">
          {Object.keys(BREATHING_PATTERNS).map((key) => (
            <button
              key={key}
              onClick={() => setPatternKey(key as BreathingPatternKey)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                patternKey === key ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {['great', 'okay', 'stressed', 'overwhelmed'].map((m) => (
            <button
              key={m}
              onClick={() => setMoodBefore(moodBefore === m ? null : m)}
              className={`w-12 h-12 rounded-full text-xl transition-all ${
                moodBefore === m ? 'ring-2 ring-purple-500 scale-110' : 'hover:scale-105'
              }`}
            >
              {{ great: '😊', okay: '😐', stressed: '😫', overwhelmed: '😵' }[m]}
            </button>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="w-48 py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
        >
          Comenzar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <BreathingCircle phase={phase} progress={progress} />

      <div className="text-center">
        <p className="text-2xl font-bold text-purple-900">{phase.label}</p>
        <p className="text-sm text-gray-400">
          Ciclo {cycle} de {totalCycles} · {Math.round(elapsedSeconds)}s
        </p>
      </div>

      <div className="w-full max-w-xs bg-gray-100 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-purple-500 transition-all duration-300"
          style={{ width: `${overallProgress * 100}%` }}
        />
      </div>

      <div className="flex gap-4">
        {isActive ? (
          <button onClick={pause} className="px-6 py-2 rounded-full bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors">
            Pausa
          </button>
        ) : isPaused ? (
          <>
            <button onClick={resume} className="px-6 py-2 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors">
              Continuar
            </button>
            <button onClick={stop} className="px-6 py-2 rounded-full bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors">
              Terminar
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
