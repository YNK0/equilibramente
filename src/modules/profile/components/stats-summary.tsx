'use client';

import type { ProfileStats } from '../types';

interface Props {
  stats: ProfileStats;
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

interface StatItem {
  key: keyof ProfileStats;
  label: string;
  format?: (value: number, stats: ProfileStats) => string;
}

const STAT_ITEMS: StatItem[] = [
  { key: 'total_days', label: 'Dias usando la app' },
  { key: 'total_checkins', label: 'Check-ins' },
  { key: 'total_tasks_completed', label: 'Tareas completadas' },
  {
    key: 'total_regulation_minutes',
    label: 'Tiempo en regulacion',
    format: (v) => formatMinutes(v),
  },
  {
    key: 'achievements_total',
    label: 'Logros',
    format: (_v, s) => `${s.achievements_unlocked}/${s.achievements_total}`,
  },
  { key: 'longest_streak', label: 'Mejor racha', format: (v) => `${v} dias` },
];

export function StatsSummary({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {STAT_ITEMS.map(({ key, label, format }) => {
        const raw = stats[key] as number;
        const value = format ? format(raw, stats) : String(raw ?? 0);

        return (
          <div key={key} className="rounded-xl bg-purple-50 border border-purple-100 p-3">
            <p className="text-2xl font-bold text-purple-700">{value}</p>
            <p className="text-xs text-purple-600 mt-0.5">{label}</p>
          </div>
        );
      })}
    </div>
  );
}
