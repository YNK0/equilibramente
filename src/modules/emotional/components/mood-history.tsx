'use client';

import { useMoodStats } from '../hooks/use-mood-stats';
import { MOOD_CONFIGS } from '../constants';
import { PageLoading } from '@/modules/shared/components/ui/loading';
import { EmptyState } from '@/modules/shared/components/ui/empty-state';

export function MoodHistory() {
  const { stats, loading } = useMoodStats(7);

  if (loading) return <PageLoading />;
  if (!stats || stats.total_checkins === 0) {
    return (
      <EmptyState
        icon="📊"
        title="Sin datos aun"
        description="Haz tu primer check-in para ver tu historial"
      />
    );
  }

  return (
    <div className="px-4 py-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Ultimos 7 dias</h3>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        {Object.entries(stats.mood_distribution).map(([mood, count]) => {
          const config = MOOD_CONFIGS[mood as keyof typeof MOOD_CONFIGS];
          if (!config || count === 0) return null;
          return (
            <div
              key={mood}
              className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-white px-3 py-1.5 shadow-sm"
            >
              <span className="text-lg">{config.emoji}</span>
              <span className="text-xs font-medium text-gray-600">{count}</span>
            </div>
          );
        })}
      </div>
      {stats.mood_trend === 'improving' && (
        <p className="text-xs text-green-600 mt-2">Tu estado de animo esta mejorando</p>
      )}
      {stats.mood_trend === 'declining' && (
        <p className="text-xs text-amber-600 mt-2">Tu estado de animo ha bajado estos dias</p>
      )}
    </div>
  );
}
