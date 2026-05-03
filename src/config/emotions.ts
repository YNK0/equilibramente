import type { MoodLevel, MoodConfig } from '@/types/database';

export const MOOD_CONFIGS: Record<MoodLevel, MoodConfig> = {
  great:       { value: 'great',       emoji: '😄', label: 'Bien',         color: '#22c55e' },
  okay:        { value: 'okay',        emoji: '😐', label: 'Normal',       color: '#eab308' },
  stressed:    { value: 'stressed',    emoji: '😫', label: 'Estresado',    color: '#f97316' },
  overwhelmed: { value: 'overwhelmed', emoji: '😣', label: 'Saturado',     color: '#ef4444' },
};

export const MOOD_RESPONSES: Record<MoodLevel, { message: string; gradient: string }> = {
  great:       { message: 'Que bien que te sientas asi. A mantener el ritmo.', gradient: 'from-green-400 to-emerald-500' },
  okay:        { message: 'Un dia a la vez. Estas avanzando.',                 gradient: 'from-yellow-400 to-amber-500' },
  stressed:    { message: 'Vamos a ayudarte a enfocarte.',                     gradient: 'from-orange-400 to-red-400' },
  overwhelmed: { message: 'Respira. No estas solo. Te ayudamos paso a paso.',  gradient: 'from-red-400 to-rose-500' },
};
