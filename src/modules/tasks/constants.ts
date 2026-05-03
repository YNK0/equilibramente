import type { Difficulty, DifficultyConfig, TaskStatus } from './types';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  low: {
    value: 'low',
    label: 'Baja',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    weight: 1,
  },
  medium: {
    value: 'medium',
    label: 'Media',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    weight: 2,
  },
  high: {
    value: 'high',
    label: 'Alta',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    weight: 3,
  },
};

export const URGENCY_COLORS = {
  today: { border: 'border-red-400', text: 'text-red-600', badge: 'Hoy' },
  tomorrow: { border: 'border-orange-400', text: 'text-orange-600', badge: 'Manana' },
  this_week: { border: 'border-amber-400', text: 'text-amber-600', badge: null },
  later: { border: 'border-gray-200', text: 'text-gray-400', badge: null },
  none: { border: 'border-gray-200', text: 'text-gray-400', badge: null },
} as const;

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pendientes',
  in_progress: 'En progreso',
  completed: 'Completadas',
  cancelled: 'Canceladas',
};

export const ESTIMATED_TIME_OPTIONS = [15, 30, 60, 120, 180, 240];

export function getUrgencyLevel(dueDate: string): keyof typeof URGENCY_COLORS {
  const now = new Date();
  const due = new Date(dueDate);
  const days = Math.ceil((due.getTime() - now.getTime()) / 86400000);

  if (days < 0) return 'today';
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days <= 7) return 'this_week';
  return 'later';
}

export function formatDueDate(dueDate: string): string {
  const urgency = getUrgencyLevel(dueDate);
  const badge = URGENCY_COLORS[urgency].badge;
  if (badge) return badge;
  return new Date(dueDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}
