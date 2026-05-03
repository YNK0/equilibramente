import type { LoadLevel } from '@/modules/analysis/types';

interface Props {
  level: LoadLevel | null;
  score: number | null;
}

const loadConfig: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: 'Baja', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  moderate: { label: 'Moderada', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  high: { label: 'Alta', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  critical: { label: 'Crítica', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
};

export function LoadCard({ level, score }: Props) {
  const config = level ? loadConfig[level] : loadConfig.low;

  return (
    <div className={`p-4 rounded-xl border ${config.bg}`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-700">Carga actual</h3>
        <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
      </div>
      {score !== null && (
        <>
          <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                level === 'critical' ? 'bg-red-500' :
                level === 'high' ? 'bg-amber-500' :
                level === 'moderate' ? 'bg-blue-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((score / 20) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{score.toFixed(1)} / 20</p>
        </>
      )}
    </div>
  );
}
