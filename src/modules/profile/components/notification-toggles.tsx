'use client';

import { pushSupported, subscribeToPush } from '@/lib/notifications/push';
import type { NotificationPrefs } from '../types';

interface Props {
  prefs: NotificationPrefs;
  onToggle: (key: string, value: boolean) => Promise<void>;
  disabled: boolean;
}

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled: boolean;
}

function ToggleRow({ label, description, value, onChange, disabled }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors
          ${value ? 'bg-purple-600' : 'bg-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform
            ${value ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}

const TOGGLES = [
  {
    key: 'checkin_reminder',
    label: 'Recordatorio de check-in',
    description: 'Recordatorio diario para registrar tu estado emocional',
  },
  {
    key: 'task_reminder',
    label: 'Recordatorio de tareas',
    description: 'Tareas proximas a su fecha de entrega',
  },
  {
    key: 'stress_alert',
    label: 'Alerta de estres',
    description: 'Notificacion cuando tu carga es alta o critica',
  },
  {
    key: 'achievement_notify',
    label: 'Logros desbloqueados',
    description: 'Notificacion cuando desbloqueas un logro',
  },
];

export function NotificationToggles({ prefs, onToggle, disabled }: Props) {
  const supported = pushSupported();

  if (!supported) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-gray-500">Tu navegador no soporta notificaciones push.</p>
      </div>
    );
  }

  const handleToggle = async (key: string, value: boolean) => {
    if (value && !prefs.push_subscription) {
      const sub = await subscribeToPush();
      if (!sub) return;
    }
    await onToggle(key, value);
  };

  return (
    <div className="divide-y divide-gray-100">
      {TOGGLES.map((t) => (
        <ToggleRow
          key={t.key}
          label={t.label}
          description={t.description}
          value={!!prefs[t.key as keyof NotificationPrefs]}
          onChange={(v) => handleToggle(t.key, v)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
