export const CATEGORY_LABELS: Record<string, string> = {
  streak: 'Rachas',
  tasks: 'Tareas',
  regulation: 'Regulación',
  reflection: 'Reflexión',
  emotional: 'Emocional',
};

export const TIER_COLORS: Record<number, { bg: string; border: string; text: string; label: string }> = {
  1: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'Bronce' },
  2: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', label: 'Plata' },
  3: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'Oro' },
};

export const STREAK_LABELS: Record<string, string> = {
  checkin: 'Check-in',
  task_completion: 'Tareas completadas',
  reflection: 'Reflexión',
  regulation: 'Regulación',
};
