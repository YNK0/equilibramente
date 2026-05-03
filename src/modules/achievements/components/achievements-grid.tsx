'use client';

import { motion } from 'framer-motion';
import { AchievementBadge } from './achievement-badge';
import { ProgressRing } from './progress-ring';
import { useAchievements } from '../hooks/use-achievements';
import { CATEGORY_LABELS } from '../constants';

export function AchievementsGrid() {
  const { achievements, summary, loading } = useAchievements();

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-center py-4">
          <div className="h-[120px] w-[120px] rounded-full bg-gray-100 animate-pulse" />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const categories = [...new Set(achievements.map((a) => a.category))];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-center py-4">
        <ProgressRing unlocked={summary.unlocked} total={summary.total} size={120} />
      </div>

      <p className="text-center text-sm text-gray-500">
        {summary.unlocked} de {summary.total} logros desbloqueados
      </p>

      {categories.map((category) => {
        const categoryAchievements = achievements.filter((a) => a.category === category);
        return (
          <div key={category}>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {CATEGORY_LABELS[category] || category}
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {categoryAchievements.map((achievement, i) => (
                <motion.div
                  key={achievement.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <AchievementBadge achievement={achievement} />
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
