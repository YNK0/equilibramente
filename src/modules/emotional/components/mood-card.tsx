'use client';

import { motion } from 'framer-motion';
import { tapScale } from '@/lib/motion';
import type { MoodConfig, MoodLevel } from '../types';

interface Props {
  config: MoodConfig;
  onSelect: (mood: MoodLevel) => void;
  disabled: boolean;
  isSelected: boolean;
}

export function MoodCard({ config, onSelect, disabled, isSelected }: Props) {
  return (
    <motion.button
      {...tapScale}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      animate={{ scale: isSelected ? 1.1 : 1, opacity: disabled && !isSelected ? 0.4 : 1 }}
      onClick={() => !disabled && onSelect(config.value)}
      disabled={disabled}
      className={`
        flex flex-col items-center gap-3 rounded-2xl border p-6
        transition-colors min-h-[120px]
        focus:outline-none focus:ring-2 focus:ring-purple-400
        ${isSelected
          ? 'border-purple-300 bg-purple-50 ring-2 ring-purple-200'
          : 'border-gray-100 bg-white shadow-sm'
        }
      `}
      aria-label={config.label}
      role="radio"
      aria-checked={isSelected}
    >
      <span className="text-5xl" role="img" aria-hidden="true">
        {config.emoji}
      </span>
      <span className="text-sm font-medium text-gray-700">{config.label}</span>
    </motion.button>
  );
}
