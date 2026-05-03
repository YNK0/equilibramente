'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ActivePauseExercise } from '../types';

interface Props {
  exercise: ActivePauseExercise;
  onComplete: () => void;
  onSkip: () => void;
}

export function PauseExercise({ exercise, onComplete, onSkip }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(exercise.duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, secondsLeft, onComplete]);

  const progress = ((exercise.duration - secondsLeft) / exercise.duration) * 100;

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="w-32 h-32 rounded-full bg-purple-50 flex items-center justify-center">
        <span className="text-5xl">🧘</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{exercise.title}</h3>
      <p className="text-sm text-gray-500 text-center">{exercise.instruction}</p>
      <div className="text-3xl font-bold text-purple-600 tabular-nums">
        {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
      </div>
      <div className="w-full max-w-xs bg-gray-100 rounded-full h-2">
        <div className="h-2 rounded-full bg-purple-500 transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }} />
      </div>
      <button onClick={onSkip} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
        Saltar
      </button>
    </div>
  );
}
