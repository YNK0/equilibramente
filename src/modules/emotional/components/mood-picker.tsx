'use client';

import { AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { MOOD_CONFIGS } from '../constants';
import { useCheckin } from '../hooks/use-checkin';
import type { MoodLevel } from '../types';
import { MoodCard } from './mood-card';
import { MoodConfirmation } from './mood-confirmation';

interface Props {
  onComplete?: () => void;
}

export function MoodPicker({ onComplete }: Props) {
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { submit, loading, error } = useCheckin();

  const handleSelect = useCallback(
    async (mood: MoodLevel) => {
      setSelectedMood(mood);
      if (navigator.vibrate) navigator.vibrate(50);
      try {
        await submit({ mood });
        setShowConfirmation(true);
      } catch {
        setSelectedMood(null);
      }
    },
    [submit]
  );

  const handleDismiss = useCallback(() => {
    setSelectedMood(null);
    setShowConfirmation(false);
    onComplete?.();
  }, [onComplete]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <span className="text-5xl mb-4">😕</span>
        <h3 className="text-lg font-semibold text-gray-900">Algo salio mal</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <button
          onClick={() => handleDismiss()}
          className="mt-6 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white
            shadow-sm hover:bg-purple-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Como te sientes hoy?</h1>
        <p className="text-sm text-gray-500 mt-1">Toma 5 segundos, sin presion</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {Object.values(MOOD_CONFIGS).map((config) => (
          <MoodCard
            key={config.value}
            config={config}
            onSelect={handleSelect}
            disabled={loading || showConfirmation}
            isSelected={selectedMood === config.value}
          />
        ))}
      </div>

      <AnimatePresence>
        {showConfirmation && selectedMood && (
          <MoodConfirmation mood={selectedMood} onDismiss={handleDismiss} />
        )}
      </AnimatePresence>
    </div>
  );
}
