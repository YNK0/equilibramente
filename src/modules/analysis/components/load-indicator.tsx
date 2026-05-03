'use client';

import { motion } from 'framer-motion';
import type { LoadLevel } from '../types';
import { LOAD_LEVEL_CONFIGS } from '../constants';

interface Props {
  level: LoadLevel | null;
  score?: number;
  trend?: 'improving' | 'stable' | 'worsening' | null;
  loading?: boolean;
}

export function LoadIndicator({ level, score, trend, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="h-2 bg-gray-200 rounded-full w-full" />
      </div>
    );
  }

  if (!level) {
    return (
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
        <p className="text-sm text-gray-500">Completa tu check-in y agrega tareas</p>
      </div>
    );
  }

  const config = LOAD_LEVEL_CONFIGS[level];
  const pct = score ? Math.min((score / 18) * 100, 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.emoji}</span>
          <span className={`font-semibold ${config.textColor}`}>Carga: {config.label}</span>
        </div>
        {trend && (
          <span className="text-xs text-gray-500">
            {trend === 'worsening' ? '↑' : trend === 'improving' ? '↓' : '→'}
          </span>
        )}
      </div>

      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: config.color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(pct, 4)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {score !== undefined && (
        <p className="text-xs text-gray-400 text-right">Score: {score}</p>
      )}
    </div>
  );
}
