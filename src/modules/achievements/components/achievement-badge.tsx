'use client';

import { TIER_COLORS } from '../constants';
import type { Achievement } from '../types';

interface AchievementBadgeProps {
  achievement: Achievement;
  onClick?: () => void;
}

export function AchievementBadge({ achievement, onClick }: AchievementBadgeProps) {
  const tierStyle = TIER_COLORS[achievement.tier] || TIER_COLORS[1];

  return (
    <button
      onClick={onClick}
      disabled={!achievement.unlocked}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-colors ${
        achievement.unlocked
          ? `${tierStyle.bg} ${tierStyle.border} cursor-pointer hover:brightness-95`
          : 'bg-gray-50 border-gray-100 cursor-default opacity-60'
      }`}
    >
      <span className="text-2xl relative">
        {achievement.icon}
        {!achievement.unlocked && (
          <span className="absolute -bottom-0.5 -right-0.5 text-xs">🔒</span>
        )}
      </span>
      <span
        className={`text-[11px] font-medium leading-tight ${achievement.unlocked ? 'text-gray-800' : 'text-gray-400'}`}
      >
        {achievement.title}
      </span>
    </button>
  );
}
