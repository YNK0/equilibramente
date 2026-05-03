export const DIFFICULTY_WEIGHTS = { low: 1.0, medium: 2.0, high: 3.5 } as const;
export const URGENCY_WEIGHTS = { within_6h: 2.0, within_24h: 1.5, within_48h: 1.0, within_7d: 0.3 } as const;
export const MOOD_WEIGHTS = { great: 0.85, okay: 1.0, stressed: 1.2, overwhelmed: 1.5, default: 1.1 } as const;

export const LOAD_THRESHOLDS = {
  low:      { min: 0,    max: 4.9 },
  moderate: { min: 5.0,  max: 9.9 },
  high:     { min: 10.0, max: 17.9 },
  critical: { min: 18.0, max: Infinity },
} as const;

export const ANALYSIS_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes
export const MAX_PENDING_TASKS = 50;
export const MIN_REGULATION_SECONDS = 30;
export const MAX_NOTE_CHARS = 140;
export const MAX_RECOMMENDATIONS = 3;
