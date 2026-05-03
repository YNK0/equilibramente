'use client';

import { STREAK_LABELS } from '../constants';
import { useStreaks } from '../hooks/use-streaks';
import { StreakBar } from './streak-bar';

function getWeekdays(): boolean[] {
  const days: boolean[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(false);
  }
  return days;
}

export function StreakDisplay() {
  const { streaks, loading } = useStreaks();
  const weekdays = getWeekdays();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (streaks.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center">
        <p className="text-sm text-gray-500">Empieza tu primera racha. ¡Haz un check-in hoy!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {streaks.map((streak) => (
        <div
          key={streak.type}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {streak.current_count >= 30
                  ? '💎'
                  : streak.current_count >= 14
                    ? '🌟'
                    : streak.current_count >= 7
                      ? '⭐'
                      : streak.current_count >= 3
                        ? '🔥'
                        : '⚡'}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {STREAK_LABELS[streak.type] || streak.type}
                </p>
                <p className="text-xs text-gray-500">Record: {streak.longest_count} días</p>
              </div>
            </div>
            <span className="text-xl font-bold text-purple-600">{streak.current_count}</span>
          </div>
          <StreakBar days={weekdays} />
        </div>
      ))}
    </div>
  );
}
