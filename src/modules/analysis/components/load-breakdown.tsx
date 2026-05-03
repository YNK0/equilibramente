'use client';

import type { LoadAnalysis } from '../types';
import { LOAD_LEVEL_CONFIGS } from '../constants';

interface Props {
  analysis: LoadAnalysis;
}

export function LoadBreakdown({ analysis }: Props) {
  const config = LOAD_LEVEL_CONFIGS[analysis.load_level as keyof typeof LOAD_LEVEL_CONFIGS];

  return (
    <div className={`p-4 rounded-xl border ${config?.borderColor ?? 'border-gray-200'} ${config?.bgColor ?? 'bg-gray-50'}`}>
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Desglose de carga</h4>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tareas pendientes</span>
          <span className="font-medium">{analysis.task_count}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tareas dificiles</span>
          <span className="font-medium">{analysis.high_difficulty_count}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Entregas proximas</span>
          <span className="font-medium">{analysis.upcoming_deadlines_count}</span>
        </div>

        {analysis.last_mood && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Estado animico</span>
            <span className="font-medium capitalize">{analysis.last_mood}</span>
          </div>
        )}

        <hr className="border-gray-200" />

        <div className={`flex justify-between text-sm font-semibold ${config?.textColor ?? 'text-gray-700'}`}>
          <span>Nivel</span>
          <span>{config?.label ?? analysis.load_level}</span>
        </div>
      </div>
    </div>
  );
}
