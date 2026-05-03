// Recommendation matcher — matches load analysis results to recommendations
// Filters by trigger_condition and sorts by priority

import type { LoadResult, Recommendation } from './types.ts';

export function matchRecommendations(
  result: LoadResult,
  recommendations: Recommendation[],
  lastMood: string | null
): Recommendation[] {
  const now = new Date();
  const hour = now.getHours();
  const period: 'morning' | 'afternoon' | 'evening' =
    hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  return recommendations
    .filter((rec) => {
      if (!rec.is_active) return false;

      const trigger = rec.trigger_condition;

      // Match by load_level
      if (trigger.load_level?.length && !trigger.load_level.includes(result.level)) {
        return false;
      }

      // Match by min_difficulty_tasks
      if (
        trigger.min_difficulty_tasks !== undefined &&
        result.highDifficultyCount < trigger.min_difficulty_tasks
      ) {
        return false;
      }

      // Match by mood_in
      if (trigger.mood_in?.length && (!lastMood || !trigger.mood_in.includes(lastMood as never))) {
        return false;
      }

      // Match by time_of_day
      if (trigger.time_of_day?.length && !trigger.time_of_day.includes(period)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);
}
