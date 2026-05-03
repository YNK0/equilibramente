import type { Achievement } from '@/types/database';

export const DEFAULT_ACHIEVEMENTS: Omit<Achievement, 'id' | 'created_at'>[] = [
  // Streaks
  {
    key: 'streak_3',
    title: '3 dias seguidos',
    description: 'Check-in emocional por 3 dias',
    icon: '🔥',
    category: 'streak',
    tier: 1,
    requirement: { type: 'checkin', days: 3 },
  },
  {
    key: 'streak_7',
    title: 'Semana completa',
    description: 'Check-in emocional por 7 dias',
    icon: '⭐',
    category: 'streak',
    tier: 2,
    requirement: { type: 'checkin', days: 7 },
  },
  {
    key: 'streak_30',
    title: 'Mes de racha',
    description: 'Check-in emocional por 30 dias',
    icon: '💎',
    category: 'streak',
    tier: 3,
    requirement: { type: 'checkin', days: 30 },
  },

  // Tasks
  {
    key: 'first_task',
    title: 'Primera tarea',
    description: 'Registrar tu primera tarea',
    icon: '📝',
    category: 'tasks',
    tier: 1,
    requirement: { type: 'count', metric: 'tasks_created', count: 1 },
  },
  {
    key: 'task_master_10',
    title: 'Productivo',
    description: 'Completar 10 tareas',
    icon: '✅',
    category: 'tasks',
    tier: 1,
    requirement: { type: 'count', metric: 'tasks_completed', count: 10 },
  },
  {
    key: 'task_master_50',
    title: 'Imparable',
    description: 'Completar 50 tareas',
    icon: '🏆',
    category: 'tasks',
    tier: 3,
    requirement: { type: 'count', metric: 'tasks_completed', count: 50 },
  },

  // Regulation
  {
    key: 'first_breath',
    title: 'Primer respiro',
    description: 'Completar ejercicio de respiracion',
    icon: '🫁',
    category: 'regulation',
    tier: 1,
    requirement: { type: 'count', metric: 'regulation_sessions', count: 1 },
  },
  {
    key: 'zen_master',
    title: 'Zen master',
    description: '10 sesiones de regulacion',
    icon: '🧘',
    category: 'regulation',
    tier: 2,
    requirement: { type: 'count', metric: 'regulation_sessions', count: 10 },
  },

  // Reflection
  {
    key: 'first_reflection',
    title: 'Primera reflexion',
    description: 'Completar reflexion diaria',
    icon: '💭',
    category: 'reflection',
    tier: 1,
    requirement: { type: 'count', metric: 'reflections', count: 1 },
  },
  {
    key: 'deep_thinker',
    title: 'Pensador profundo',
    description: '7 reflexiones completadas',
    icon: '🧠',
    category: 'reflection',
    tier: 2,
    requirement: { type: 'count', metric: 'reflections', count: 7 },
  },

  // Special
  {
    key: 'survivor',
    title: 'Sobreviviente',
    description: 'Superar un dia con carga critica',
    icon: '🦾',
    category: 'emotional',
    tier: 2,
    requirement: { type: 'event', metric: 'survived_critical' },
  },
  {
    key: 'mood_tracker',
    title: 'Conocete',
    description: 'Registrar todos los moods posibles',
    icon: '🎭',
    category: 'emotional',
    tier: 2,
    requirement: { type: 'all_moods' },
  },
];
