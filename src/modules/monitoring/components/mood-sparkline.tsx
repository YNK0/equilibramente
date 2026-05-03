'use client';

import type { MoodLevel } from '@/modules/emotional/types';
import { MOOD_TO_NUMBER } from '../constants';

interface Props {
  days: Array<{ date: string; mood: MoodLevel | null }>;
  trend: 'improving' | 'stable' | 'worsening';
}

export function MoodSparkline({ days, trend }: Props) {
  const data = days.filter((d) => d.mood).map((d) => MOOD_TO_NUMBER[d.mood!]);

  const trendConfig = {
    improving: { icon: '↑', label: 'Mejorando', color: 'text-green-500' },
    worsening: { icon: '↓', label: 'Empeorando', color: 'text-red-500' },
    stable: { icon: '→', label: 'Estable', color: 'text-gray-400' },
  }[trend];

  const maxH = 40;
  const minVal = 1;
  const maxVal = 5;
  const points = data
    .map((v, i) => {
      const x = data.length > 1 ? (i / (data.length - 1)) * 100 : 50;
      const y = maxH - ((v - minVal) / (maxVal - minVal)) * maxH;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Estado de ánimo</h3>
        <span className={`text-xs font-medium ${trendConfig.color}`}>
          {trendConfig.icon} {trendConfig.label}
        </span>
      </div>

      {data.length > 1 ? (
        <svg viewBox="0 0 100 40" className="w-full h-12">
          <polyline
            points={points}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((v, i) => {
            const x = data.length > 1 ? (i / (data.length - 1)) * 100 : 50;
            const y = maxH - ((v - minVal) / (maxVal - minVal)) * maxH;
            return <circle key={i} cx={x} cy={y} r="2" fill="#7c3aed" />;
          })}
        </svg>
      ) : (
        <p className="text-sm text-gray-400 text-center py-2">
          Registra tu estado emocional para ver la tendencia
        </p>
      )}
    </div>
  );
}
