// Load score algorithm — matches frontend src/modules/analysis/utils/load-calculator.ts
// Must stay in sync. Same weights, same logic, deterministic output.

import type { Task, EmotionalCheckin, LoadResult, LoadLevel } from './types.ts';

const WEIGHTS = {
  DIFFICULTY: { low: 1.0, medium: 2.0, high: 3.5 },
  URGENCY: { within_6h: 2.0, within_24h: 1.5, within_48h: 1.0, within_7d: 0.3 },
  MOOD: { great: 0.85, okay: 1.0, stressed: 1.2, overwhelmed: 1.5, default: 1.1 },
};

export function calculateLoad(
  tasks: Task[],
  lastCheckin: EmotionalCheckin | null
): LoadResult {
  const pendingTasks = tasks.filter(
    (t) => t.status === 'pending' || t.status === 'in_progress'
  );

  let taskLoad = 0;
  let highDifficultyCount = 0;

  for (const task of pendingTasks) {
    const diffWeight = WEIGHTS.DIFFICULTY[task.difficulty];
    const statusMod = task.status === 'in_progress' ? 0.8 : 1.0;
    taskLoad += diffWeight * statusMod;

    if (task.difficulty === 'high') highDifficultyCount++;
  }

  let urgencyBonus = 0;
  let upcomingDeadlinesCount = 0;
  const now = new Date();

  for (const task of pendingTasks) {
    if (!task.due_date) continue;
    const dueDate = new Date(task.due_date);
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDue < 0) continue;

    if (hoursUntilDue < 6) {
      urgencyBonus += WEIGHTS.URGENCY.within_6h;
      upcomingDeadlinesCount++;
    } else if (hoursUntilDue < 24) {
      urgencyBonus += WEIGHTS.URGENCY.within_24h;
      upcomingDeadlinesCount++;
    } else if (hoursUntilDue < 48) {
      urgencyBonus += WEIGHTS.URGENCY.within_48h;
      upcomingDeadlinesCount++;
    } else if (hoursUntilDue < 168) {
      urgencyBonus += WEIGHTS.URGENCY.within_7d;
    }
  }

  const mood = lastCheckin?.mood ?? null;
  const moodModifier =
    mood && mood in WEIGHTS.MOOD
      ? WEIGHTS.MOOD[mood as keyof typeof WEIGHTS.MOOD]
      : WEIGHTS.MOOD.default;

  const score = parseFloat(((taskLoad + urgencyBonus) * moodModifier).toFixed(1));

  return {
    score,
    level: getLoadLevel(score),
    taskLoad: parseFloat(taskLoad.toFixed(1)),
    urgencyBonus: parseFloat(urgencyBonus.toFixed(1)),
    moodModifier,
    highDifficultyCount,
    upcomingDeadlinesCount,
  };
}

function getLoadLevel(score: number): LoadLevel {
  if (score >= 18.0) return 'critical';
  if (score >= 10.0) return 'high';
  if (score >= 5.0) return 'moderate';
  return 'low';
}
