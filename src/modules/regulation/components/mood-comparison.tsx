'use client';

import { useState } from 'react';

interface Props {
  before: string | null;
  after: string | null;
  onAfterChange: (mood: string | null) => Promise<void>;
}

const moodLabels: Record<string, { emoji: string; label: string }> = {
  great: { emoji: '😊', label: 'Genial' },
  okay: { emoji: '😐', label: 'Estable' },
  stressed: { emoji: '😫', label: 'Estresado' },
  overwhelmed: { emoji: '😵', label: 'Abrumado' },
};

export function MoodComparison({ before, after, onAfterChange }: Props) {
  const [selected, setSelected] = useState<string | null>(after);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onAfterChange(selected);
    setSaving(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
        <span className="text-3xl">✅</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">¡Completado!</h3>

      {before && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">Antes: {moodLabels[before]?.emoji}</span>
          <span className="text-gray-300">→</span>
          <span className="text-gray-600">Ahora: {selected ? moodLabels[selected]?.emoji : '?'}</span>
        </div>
      )}

      <p className="text-sm text-gray-500">¿Cómo te sientes ahora?</p>
      <div className="flex gap-2">
        {Object.entries(moodLabels).map(([key, { emoji, label }]) => (
          <button
            key={key}
            onClick={() => setSelected(selected === key ? null : key)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              selected === key ? 'ring-2 ring-purple-500 bg-purple-50 scale-105' : 'hover:bg-gray-50'
            }`}
            title={label}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-[10px] text-gray-400">{label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2 rounded-full bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {saving ? 'Guardando...' : 'Listo'}
      </button>
    </div>
  );
}
