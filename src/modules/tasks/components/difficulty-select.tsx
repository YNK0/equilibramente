'use client';

import { DIFFICULTY_CONFIGS } from '../constants';
import type { Difficulty } from '../types';

interface Props {
  value: Difficulty | '';
  onChange: (d: Difficulty) => void;
  error?: string;
}

export function DifficultySelect({ value, onChange, error }: Props) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-700 mb-1 block">Dificultad</label>
      <div className="flex gap-2">
        {Object.values(DIFFICULTY_CONFIGS).map((config) => (
          <button
            key={config.value}
            type="button"
            onClick={() => onChange(config.value)}
            className={`
              flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-purple-200
              ${
                value === config.value
                  ? `${config.borderColor} ${config.bgColor} ${config.textColor} ring-1`
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }
            `}
          >
            {config.label}
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
