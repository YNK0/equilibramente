'use client';

import { useState, useEffect, useCallback } from 'react';
import { reflectionService } from '../services/reflection-service';
import type { DailyReflection, ReflectionInput } from '../types';

export function useReflection() {
  const [todayReflection, setTodayReflection] = useState<DailyReflection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    reflectionService.getToday()
      .then(setTodayReflection)
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (input: ReflectionInput) => {
    setSaving(true);
    const reflection = await reflectionService.save(input);
    setTodayReflection(reflection);
    setSaving(false);
    return reflection;
  }, []);

  return {
    todayReflection,
    hasTodayReflection: !!todayReflection,
    loading,
    saving,
    save,
  };
}
