'use client';

import { useState } from 'react';

interface Props {
  start: string | null;
  end: string | null;
  onChange: (start: string, end: string) => Promise<void>;
  disabled: boolean;
}

function formatTimeRange(start: string | null, end: string | null): string {
  if (!start || !end) return 'No configurado';
  return `${start.slice(0, 5)} - ${end.slice(0, 5)}`;
}

export function QuietHoursPicker({ start, end, onChange, disabled }: Props) {
  const [editing, setEditing] = useState(false);
  const [startVal, setStartVal] = useState(start || '22:00');
  const [endVal, setEndVal] = useState(end || '07:00');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (startVal >= endVal) return;
    try {
      setSaving(true);
      await onChange(`${startVal}:00`, `${endVal}:00`);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="py-3 space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-500">Inicio</label>
            <input
              type="time"
              value={startVal}
              onChange={(e) => setStartVal(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              disabled={saving || disabled}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-500">Fin</label>
            <input
              type="time"
              value={endVal}
              onChange={(e) => setEndVal(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              disabled={saving || disabled}
            />
          </div>
        </div>
        {startVal >= endVal && (
          <p className="text-xs text-red-500">La hora de fin debe ser mayor a la de inicio</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(false)}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || startVal >= endVal || disabled}
            className="flex-1 rounded-lg bg-purple-600 py-2 text-sm font-medium text-white
              disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      disabled={disabled}
      className="w-full flex items-center justify-between py-3 text-left"
    >
      <div>
        <p className="text-sm font-medium text-gray-900">Horas silenciosas</p>
        <p className="text-xs text-gray-500 mt-0.5">{formatTimeRange(start, end)}</p>
      </div>
      <span className="text-sm text-purple-600">Editar</span>
    </button>
  );
}
