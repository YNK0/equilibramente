import type { MoodConfig, MoodLevel, MoodResponse } from './types';

export const MOOD_CONFIGS: Record<MoodLevel, MoodConfig> = {
  great: { value: 'great', emoji: '😊', label: 'Bien', color: '#22c55e' },
  okay: { value: 'okay', emoji: '😐', label: 'Regular', color: '#3b82f6' },
  stressed: { value: 'stressed', emoji: '😟', label: 'Estresado', color: '#f59e0b' },
  overwhelmed: { value: 'overwhelmed', emoji: '😫', label: 'Abrumado', color: '#ef4444' },
};

export const MOOD_RESPONSES: Record<MoodLevel, MoodResponse> = {
  great: {
    message: 'Que bien que te sientas asi. A mantener el ritmo.',
    gradient: 'from-green-400 to-emerald-500',
  },
  okay: { message: 'Un dia a la vez. Estas avanzando.', gradient: 'from-blue-400 to-blue-500' },
  stressed: { message: 'Vamos a ayudarte a enfocarte.', gradient: 'from-amber-400 to-orange-400' },
  overwhelmed: {
    message: 'Respira. No estas solo. Te ayudamos paso a paso.',
    gradient: 'from-red-400 to-rose-500',
  },
};
