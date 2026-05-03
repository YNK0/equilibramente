'use client';

import { motion } from 'framer-motion';
import type { BreathingPhase } from '../types';

interface Props {
  phase: BreathingPhase;
  progress: number;
}

export function BreathingCircle({ phase, progress }: Props) {
  const scale = phase.name.includes('exhale')
    ? 1 - progress * 0.2
    : phase.name.includes('hold')
      ? 1.2
      : 1 + progress * 0.2;
  const circumference = 2 * Math.PI * 46;
  const offset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      <div className="absolute w-full h-full rounded-full bg-purple-100/30" />
      <motion.div
        animate={{ scale }}
        transition={{ duration: 0.1, ease: 'easeInOut' }}
        className="absolute w-48 h-48 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${phase.color}40` }}
      >
        <span className="text-4xl font-light text-purple-900 select-none">{phase.label}</span>
      </motion.div>
      <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="none" stroke={`${phase.color}20`} strokeWidth="4" />
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={phase.color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-100 ease-linear"
        />
      </svg>
    </div>
  );
}
