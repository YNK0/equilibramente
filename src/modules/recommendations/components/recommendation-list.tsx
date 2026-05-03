'use client';

import { AnimatePresence } from 'framer-motion';
import { RecommendationCard } from './recommendation-card';
import { RecommendationEmpty } from './recommendation-empty';
import type { Recommendation } from '../types';
import type { LoadLevel } from '@/modules/analysis/types';
import { LOAD_LEVEL_CONFIGS } from '@/modules/analysis/constants';

interface Props {
  recommendations: Recommendation[];
  loadLevel: LoadLevel | null;
  loading?: boolean;
  onDismiss: (id: string) => void;
  onAction?: (id: string) => void;
}

export function RecommendationList({ recommendations, loadLevel, loading, onDismiss, onAction }: Props) {
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  const config = loadLevel ? LOAD_LEVEL_CONFIGS[loadLevel] : null;

  return (
    <div className="space-y-3">
      {config && (
        <div className="flex items-center gap-2 px-1">
          <span>{config.emoji}</span>
          <span className={`text-sm font-medium ${config.textColor}`}>
            Carga {config.label}
          </span>
        </div>
      )}

      <AnimatePresence>
        {recommendations.length === 0 ? (
          <RecommendationEmpty />
        ) : (
          recommendations.slice(0, 3).map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onDismiss={() => onDismiss(rec.id)}
              onAction={onAction}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
