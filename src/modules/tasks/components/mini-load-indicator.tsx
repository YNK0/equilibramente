'use client';

import { motion } from 'framer-motion';

const LOAD_COLORS: Record<string, string> = {
  low:      'bg-green-400',
  moderate: 'bg-amber-400',
  high:     'bg-orange-400',
  critical: 'bg-red-500',
};

const LOAD_LABELS: Record<string, string> = {
  low:      'Baja',
  moderate: 'Moderada',
  high:     'Alta',
  critical: 'Critica',
};

interface Props {
  loadLevel: string;
  percentage: number;
  onClick?: () => void;
}

export function MiniLoadIndicator({ loadLevel, percentage, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 w-full"
    >
      <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${LOAD_COLORS[loadLevel] || 'bg-gray-400'}`}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs font-medium text-gray-500">
        {LOAD_LABELS[loadLevel] || loadLevel}
      </span>
    </button>
  );
}
