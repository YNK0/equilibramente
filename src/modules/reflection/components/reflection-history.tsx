'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { STAR_LABELS } from '../constants';
import { reflectionService } from '../services/reflection-service';
import type { DailyReflection } from '../types';

export function ReflectionHistory() {
  const [reflections, setReflections] = useState<DailyReflection[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reflectionService
      .getHistory()
      .then(setReflections)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (reflections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-5xl mb-4">💭</span>
        <h3 className="text-lg font-semibold text-gray-900">Sin reflexiones aún</h3>
        <p className="mt-1 text-sm text-gray-500 max-w-xs">
          Tus reflexiones diarias aparecerán aquí. Tómate 2 minutos al final del día.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {reflections.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <button
            onClick={() => setExpanded(expanded === r.id ? null : r.id)}
            className="w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-left hover:border-purple-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {new Date(r.reflection_date).toLocaleDateString('es-MX', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
              <div className="flex items-center gap-2">
                {r.day_rating && (
                  <span className="text-xs text-gray-500">{STAR_LABELS[r.day_rating]}</span>
                )}
                <span className="text-xs text-gray-400">{expanded === r.id ? '▲' : '▼'}</span>
              </div>
            </div>

            <AnimatePresence>
              {expanded === r.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                    {r.question_1 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">¿Qué te estresó hoy?</p>
                        <p className="text-sm text-gray-700">{r.question_1}</p>
                      </div>
                    )}
                    {r.question_2 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">¿Qué te ayudó?</p>
                        <p className="text-sm text-gray-700">{r.question_2}</p>
                      </div>
                    )}
                    {r.question_3 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">¿Qué harías diferente?</p>
                        <p className="text-sm text-gray-700">{r.question_3}</p>
                      </div>
                    )}
                    {r.day_rating && (
                      <div className="flex items-center gap-1 pt-1">
                        <span className="text-xs text-gray-500">Día:</span>
                        <span>
                          {'⭐'.repeat(r.day_rating)}
                          {'☆'.repeat(5 - r.day_rating)}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      ))}
    </div>
  );
}
