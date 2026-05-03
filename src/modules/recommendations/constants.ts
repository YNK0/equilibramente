import type { RecommendationCategory } from './types';

export const CATEGORY_LABELS: Record<RecommendationCategory, string> = {
  task_management: 'Gestion de tareas',
  pause: 'Pausa',
  emotional: 'Emocional',
  focus: 'Enfoque',
};

export const ACTION_ROUTES: Record<RecommendationCategory, string> = {
  task_management: '/tareas',
  pause: '/regular',
  emotional: '/regular/respiracion',
  focus: '/regular/audios',
};

export const ACTION_LABELS: Record<RecommendationCategory, string> = {
  task_management: 'Ver mis tareas',
  pause: 'Iniciar pausa',
  emotional: 'Iniciar respiracion',
  focus: 'Escuchar audio',
};

export const CATEGORY_ICONS: Record<RecommendationCategory, string> = {
  task_management: '📋',
  pause: '⏸️',
  emotional: '🧘',
  focus: '🎯',
};
