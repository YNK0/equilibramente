'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { LoadLevel } from '../types';

interface Props {
  level: LoadLevel | null;
  onAction?: () => void;
  onDismiss?: () => void;
}

export function StressAlert({ level, onAction, onDismiss }: Props) {
  const show = level === 'high' || level === 'critical';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-4 rounded-xl border ${level === 'critical' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{level === 'critical' ? '⚠️' : '⚡'}</span>
            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold text-sm ${level === 'critical' ? 'text-red-800' : 'text-orange-800'}`}
              >
                {level === 'critical' ? 'Carga critica detectada' : 'Carga alta detectada'}
              </p>
              <p className="text-xs mt-0.5 text-gray-600">
                {level === 'critical'
                  ? 'Estas en riesgo de saturacion. Toma accion ahora.'
                  : 'Tu carga academica esta alta. Considera priorizar.'}
              </p>
              <div className="flex gap-2 mt-3">
                {onAction && (
                  <button
                    onClick={onAction}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg text-white ${level === 'critical' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'} transition-colors`}
                  >
                    Ver recomendaciones
                  </button>
                )}
                {onDismiss && (
                  <button
                    onClick={onDismiss}
                    className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Entendido
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
