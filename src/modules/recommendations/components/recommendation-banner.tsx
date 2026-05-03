'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RecommendationCard } from './recommendation-card';
import type { Recommendation } from '../types';
import type { LoadLevel } from '@/modules/analysis/types';

interface Props {
  recommendations: Recommendation[];
  loadLevel: LoadLevel | null;
  onDismiss: (id: string) => void;
  onAction?: (id: string) => void;
}

const URGENCY_STYLES: Record<string, string> = {
  critical: 'bg-red-50 border-red-200',
  high: 'bg-orange-50 border-orange-200',
  moderate: 'bg-yellow-50 border-yellow-200',
  low: 'bg-green-50 border-green-200',
};

export function RecommendationBanner({ recommendations, loadLevel, onDismiss, onAction }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!recommendations?.length) return null;

  const top = recommendations[0];
  const style = loadLevel ? URGENCY_STYLES[loadLevel] ?? 'bg-purple-50 border-purple-200' : 'bg-purple-50 border-purple-200';

  return (
    <div className="sticky top-0 z-10">
      {!expanded && (
        <motion.button
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`w-full p-4 border-b ${style} flex items-center gap-3 text-left`}
          onClick={() => setExpanded(true)}
        >
          <span className="text-lg">{loadLevel === 'critical' ? '⚠️' : '💡'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{top.title}</p>
            <p className="text-xs text-gray-600 truncate">{top.description}</p>
          </div>
          <span className="text-gray-400">▼</span>
        </motion.button>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onDismiss={() => {
                    onDismiss(rec.id);
                    if (recommendations.length <= 1) setExpanded(false);
                  }}
                  onAction={onAction}
                />
              ))}
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="w-full py-2 text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
