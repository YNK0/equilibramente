'use client';

import { emotionalService } from '../services/emotional-service';
import { MOOD_CONFIGS } from '../constants';
import type { EmotionalCheckin, MoodLevel } from '../types';

interface Props {
  checkin: EmotionalCheckin;
  onChange: () => void;
}

export function MoodStateBanner({ checkin, onChange }: Props) {
  const mood = MOOD_CONFIGS[checkin.mood as keyof typeof MOOD_CONFIGS];
  const hoursAgo = Math.round(
    (Date.now() - new Date(checkin.created_at).getTime()) / 3600000
  );

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-6 text-center">
      <span className="text-5xl">{mood?.emoji ?? '😐'}</span>
      <div>
        <p className="text-lg font-semibold text-gray-900">
          Hoy te sientes: {mood?.label ?? checkin.mood}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {hoursAgo <= 0 ? 'Hace un momento' : `Hace ${hoursAgo} ${hoursAgo === 1 ? 'hora' : 'horas'}`}
        </p>
      </div>
      <button
        onClick={onChange}
        className="text-sm font-medium text-purple-600 hover:text-purple-700"
      >
        Cambiar mi estado
      </button>
    </div>
  );
}
