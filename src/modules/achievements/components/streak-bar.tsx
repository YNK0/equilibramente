interface StreakBarProps {
  days: boolean[];
}

export function StreakBar({ days }: StreakBarProps) {
  const labels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  return (
    <div className="flex items-center gap-1.5">
      {days.map((completed, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              completed
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {completed ? '✓' : labels[i]}
          </div>
        </div>
      ))}
    </div>
  );
}
