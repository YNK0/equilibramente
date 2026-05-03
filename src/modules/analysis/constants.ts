import type { LoadLevel, LoadLevelConfig } from './types';

export const WEIGHTS = {
  DIFFICULTY: {
    low: 1.0,
    medium: 2.0,
    high: 3.5,
  },
  URGENCY: {
    within_6h: 2.0,
    within_24h: 1.5,
    within_48h: 1.0,
    within_7d: 0.3,
  },
  MOOD: {
    great: 0.85,
    okay: 1.0,
    stressed: 1.2,
    overwhelmed: 1.5,
    default: 1.1,
  },
} as const;

export const LOAD_LEVEL_CONFIGS: Record<LoadLevel, LoadLevelConfig> = {
  low: {
    level: 'low',
    label: 'Tranquilo',
    emoji: '🟢',
    color: '#22c55e',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    min: 0,
    max: 4.9,
  },
  moderate: {
    level: 'moderate',
    label: 'Moderado',
    emoji: '🟡',
    color: '#eab308',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    min: 5.0,
    max: 9.9,
  },
  high: {
    level: 'high',
    label: 'Alto',
    emoji: '🟠',
    color: '#f97316',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    min: 10.0,
    max: 17.9,
  },
  critical: {
    level: 'critical',
    label: 'Critico',
    emoji: '🔴',
    color: '#ef4444',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    min: 18.0,
    max: Infinity,
  },
};

export const LOAD_LEVEL_TRANSITIONS: Record<string, string> = {
  'low→moderate': 'Tu carga esta aumentando ligeramente. Planifica con tiempo.',
  'low→high': 'ALERTA: Tu carga subio significativamente. Revisa tus prioridades.',
  'low→critical': 'URGENTE: Estas en riesgo de saturacion. Pausa y reorganiza.',
  'moderate→high': 'Tu carga esta subiendo. Considera priorizar tus tareas.',
  'moderate→critical': 'ALERTA: Carga critica. Actua ahora para evitar saturarte.',
  'high→critical': 'URGENTE: Tu carga llego a nivel critico. Necesitas una pausa.',
  'critical→high': 'Tu carga esta bajando de critico a alto. Sigue asi.',
  'critical→moderate': 'Tu carga esta bajando. Bien hecho.',
  'critical→low': 'Tu carga bajo significativamente. Excelente trabajo.',
  'high→moderate': 'Tu carga esta mejorando. Manten el ritmo.',
  'high→low': 'Tu carga bajo mucho. Estas manejando bien tus prioridades.',
  'moderate→low': 'Tu carga esta baja. Buen momento para avanzar o descansar.',
};
