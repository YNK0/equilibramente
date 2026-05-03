'use client';

import { useState, useCallback } from 'react';
import type { TaskFormData, Difficulty } from '../types';

const emptyForm: TaskFormData = {
  title: '',
  difficulty: '',
  due_date: null,
  estimated_minutes: null,
  description: null,
};

export function useTaskForm(initial?: Partial<TaskFormData>) {
  const [formData, setFormData] = useState<TaskFormData>({ ...emptyForm, ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  const setField = useCallback(<K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const e: typeof errors = {};
    if (!formData.title.trim()) e.title = 'Escribe un titulo para la tarea';
    else if (formData.title.length > 200) e.title = 'El titulo debe tener maximo 200 caracteres';
    if (!formData.difficulty) e.difficulty = 'Selecciona la dificultad';
    if (formData.description && formData.description.length > 500) e.description = 'La descripcion debe tener maximo 500 caracteres';
    if (formData.estimated_minutes && formData.estimated_minutes < 5) e.estimated_minutes = 'El tiempo minimo es 5 minutos';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [formData]);

  const reset = useCallback(() => setFormData(emptyForm), []);

  return { formData, errors, setField, validate, reset };
}
