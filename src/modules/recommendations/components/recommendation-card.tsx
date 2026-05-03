'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ACTION_LABELS, ACTION_ROUTES, CATEGORY_ICONS } from '../constants';
import type { Recommendation, RecommendationCategory } from '../types';

interface Props {
  recommendation: Recommendation;
  onDismiss: () => void;
  onAction?: (id: string) => void;
}

export function RecommendationCard({ recommendation, onDismiss, onAction }: Props) {
  const router = useRouter();
  const category = recommendation.category as RecommendationCategory;
  const route = ACTION_ROUTES[category] ?? '/dashboard';
  const label = ACTION_LABELS[category] ?? 'Ver mas';
  const icon = CATEGORY_ICONS[category] ?? '💡';

  const handleAction = () => {
    onAction?.(recommendation.id);
    router.push(route);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 border border-purple-100"
    >
      <div className="flex flex-col items-center gap-1 mt-1">
        <span className="text-lg">{icon}</span>
        <div className="flex gap-0.5">
          {Array.from({ length: Math.min(recommendation.priority, 5) }).map((_, i) => (
            <div key={i} className="w-1 h-3 rounded-full bg-purple-400" />
          ))}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm">{recommendation.title}</h4>
        <p className="text-xs text-gray-600 mt-0.5">{recommendation.description}</p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAction}
            className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {label}
          </button>
          <button
            onClick={onDismiss}
            className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Ignorar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
