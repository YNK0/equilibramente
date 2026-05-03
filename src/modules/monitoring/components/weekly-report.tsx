'use client';

import type { WeekData } from '../types';
import { MoodSparkline } from './mood-sparkline';
import { StreakRow } from './streak-row';

interface Props {
  week: WeekData;
  prevWeek: WeekData | null;
}

export function WeeklyReport({ week, prevWeek }: Props) {
  const { summary } = week;

  const comparison = prevWeek
    ? {
        tasks: summary.total_tasks_completed - (prevWeek.summary?.total_tasks_completed ?? 0),
        mood: parseFloat((summary.avg_mood - (prevWeek.summary?.avg_mood ?? 0)).toFixed(1)),
        regulation:
          (summary.total_regulation_minutes ?? 0) -
          (prevWeek.summary?.total_regulation_minutes ?? 0),
      }
    : null;

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-800">Tu semana</h2>
        <p className="text-sm text-gray-400">
          {week.week_start} → {week.week_end}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white rounded-xl border border-gray-100 text-center">
          <span className="text-2xl font-bold text-purple-700">
            {summary.total_tasks_completed}
          </span>
          <p className="text-xs text-gray-400 mt-0.5">Tareas completadas</p>
          {comparison && comparison.tasks !== 0 && (
            <span
              className={`text-[10px] ${comparison.tasks > 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {comparison.tasks > 0 ? '+' : ''}
              {comparison.tasks} vs semana anterior
            </span>
          )}
        </div>
        <div className="p-4 bg-white rounded-xl border border-gray-100 text-center">
          <span className="text-2xl font-bold text-purple-700">{summary.avg_mood.toFixed(1)}</span>
          <p className="text-xs text-gray-400 mt-0.5">Mood promedio</p>
          {comparison && comparison.mood !== 0 && (
            <span
              className={`text-[10px] ${comparison.mood > 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {comparison.mood > 0 ? '+' : ''}
              {comparison.mood} vs semana anterior
            </span>
          )}
        </div>
      </div>

      <MoodSparkline days={week.days} trend={summary.trend} />

      <StreakRow
        current={summary.streaks.checkin}
        longest={summary.streaks.checkin}
        weekDays={week.days.map((d) => d.has_checkin)}
      />

      {summary.achievements_unlocked > 0 && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
          <p className="text-sm font-semibold text-amber-800">
            🏆 {summary.achievements_unlocked} logro{summary.achievements_unlocked > 1 ? 's' : ''}{' '}
            desbloqueado{summary.achievements_unlocked > 1 ? 's' : ''} esta semana
          </p>
        </div>
      )}
    </div>
  );
}
