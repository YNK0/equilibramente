import { Flame } from 'lucide-react';

interface Props {
  current: number;
  longest: number;
  weekDays: boolean[];
}

export function StreakRow({ current, longest, weekDays }: Props) {
  const dayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const padded = weekDays.length >= 7 ? weekDays.slice(-7) : [...Array(7 - weekDays.length).fill(false), ...weekDays];

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Racha</h3>
        <div className="flex items-center gap-1">
          {current >= 7 && <Flame className="w-4 h-4 text-orange-500" />}
          <span className="text-lg font-bold text-purple-700">{current}</span>
          <span className="text-xs text-gray-400">días</span>
        </div>
      </div>
      <div className="flex justify-between gap-1">
        {padded.map((active, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                active ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {active ? '✓' : '·'}
            </div>
            <span className="text-[10px] text-gray-400">{dayLabels[i]}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-2">
        Mejor racha: {longest} días
      </p>
    </div>
  );
}
