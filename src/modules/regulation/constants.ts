import type { BreathingPattern, BreathingPatternKey, ActivePauseExercise } from './types';

export const BREATHING_PATTERNS: Record<BreathingPatternKey, BreathingPattern> = {
  '4-7-8': {
    name: 'Respiración 4-7-8',
    description: 'Reduce ansiedad en 2 minutos',
    cycles: 4,
    phases: [
      { name: 'inhale', label: 'Inhala', duration: 4, color: '#3b82f6', scale: 1.2 },
      { name: 'hold', label: 'Mantén', duration: 7, color: '#7c3aed', scale: 1.2 },
      { name: 'exhale', label: 'Exhala', duration: 8, color: '#f97316', scale: 0.8 },
    ],
  },
  box: {
    name: 'Box Breathing',
    description: 'Enfoque y calma',
    cycles: 4,
    phases: [
      { name: 'inhale', label: 'Inhala', duration: 4, color: '#3b82f6', scale: 1.2 },
      { name: 'hold_in', label: 'Mantén', duration: 4, color: '#7c3aed', scale: 1.2 },
      { name: 'exhale', label: 'Exhala', duration: 4, color: '#f97316', scale: 0.8 },
      { name: 'hold_out', label: 'Mantén', duration: 4, color: '#a855f7', scale: 0.8 },
    ],
  },
  simple: {
    name: 'Respiración 5-5',
    description: 'Simple y efectiva',
    cycles: 10,
    phases: [
      { name: 'inhale', label: 'Inhala', duration: 5, color: '#3b82f6', scale: 1.15 },
      { name: 'exhale', label: 'Exhala', duration: 5, color: '#f97316', scale: 0.85 },
    ],
  },
};

export const ACTIVE_PAUSE_SEQUENCE: ActivePauseExercise[] = [
  {
    title: 'Estiramiento de cuello',
    duration: 60,
    instruction: 'Inclina suavemente la cabeza hacia un lado. Mantén 10s. Cambia.',
    illustration: '/illustrations/neck-stretch.svg',
  },
  {
    title: 'Rotación de hombros',
    duration: 45,
    instruction: 'Rota los hombros hacia atrás lentamente. 5 veces. Luego hacia adelante.',
    illustration: '/illustrations/shoulder-roll.svg',
  },
  {
    title: 'Estiramiento de muñecas',
    duration: 30,
    instruction: 'Extiende el brazo. Con la otra mano, jala suavemente los dedos hacia atrás.',
    illustration: '/illustrations/wrist-stretch.svg',
  },
];

export const AUDIO_CATEGORIES: Record<string, { label: string; icon: string }> = {
  nature: { label: 'Naturaleza', icon: 'CloudRain' },
  meditation: { label: 'Meditación', icon: 'Sparkles' },
  music: { label: 'Música', icon: 'Music' },
  voice: { label: 'Guiada', icon: 'Mic' },
};

export const MOOD_TO_NUMBER: Record<string, number> = {
  great: 5,
  okay: 3.5,
  stressed: 2,
  overwhelmed: 1,
};
