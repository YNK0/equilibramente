'use client';

import { useCallback, useState } from 'react';
import { useTaskForm } from '../hooks/use-task-form';
import type { TaskFormData } from '../types';
import { DifficultySelect } from './difficulty-select';

interface Props {
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
}

export function TaskForm({ initialData, onSubmit, onCancel }: Props) {
  const { formData, errors, setField, validate, reset } = useTaskForm(initialData);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      setSubmitting(true);
      try {
        await onSubmit(formData);
        reset();
      } finally {
        setSubmitting(false);
      }
    },
    [formData, validate, onSubmit, reset]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setField('title', e.target.value)}
          placeholder="Que tienes que hacer?"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm
            shadow-sm placeholder:text-gray-300
            focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200
            transition-colors"
          maxLength={200}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <DifficultySelect
        value={formData.difficulty}
        onChange={(d) => setField('difficulty', d)}
        error={errors.difficulty}
      />

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-700 mb-1 block">Fecha de entrega</label>
          <input
            type="date"
            value={formData.due_date || ''}
            onChange={(e) => setField('due_date', e.target.value || null)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm
              focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200
              transition-colors"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-700 mb-1 block">Tiempo estimado</label>
          <select
            value={formData.estimated_minutes || ''}
            onChange={(e) =>
              setField('estimated_minutes', e.target.value ? Number(e.target.value) : null)
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm
              focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200
              transition-colors"
          >
            <option value="">Sin estimar</option>
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="60">1 hora</option>
            <option value="120">2 horas</option>
            <option value="180">3 horas</option>
            <option value="240">4 horas</option>
          </select>
        </div>
      </div>

      <textarea
        value={formData.description || ''}
        onChange={(e) => setField('description', e.target.value || null)}
        placeholder="Notas adicionales (opcional)"
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm
          shadow-sm placeholder:text-gray-300 resize-none
          focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200
          transition-colors"
        rows={2}
        maxLength={500}
      />

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold
            text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white
            shadow-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Guardando...' : initialData ? 'Guardar cambios' : 'Crear tarea'}
        </button>
      </div>
    </form>
  );
}
