'use client';

interface ProgressRingProps {
  unlocked: number;
  total: number;
  size?: number;
}

export function ProgressRing({ unlocked, total, size = 120 }: ProgressRingProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? unlocked / total : 0;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#a855f7"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-purple-600">{unlocked}</span>
        <span className="text-xs text-gray-400">/ {total}</span>
      </div>
    </div>
  );
}
