'use client';

import { motion } from 'framer-motion';
import { DIFFICULTY_CONFIGS, getUrgencyLevel, URGENCY_COLORS, formatDueDate, formatMinutes } from '../constants';
import type { Task } from '../types';

interface Props {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStart: (id: string) => void;
}

export function TaskCard({ task, onComplete, onEdit, onDelete, onStart }: Props) {
  const difficulty = DIFFICULTY_CONFIGS[task.difficulty as keyof typeof DIFFICULTY_CONFIGS];
  const urgency = task.due_date ? getUrgencyLevel(task.due_date) : 'none';
  const urgencyStyle = URGENCY_COLORS[urgency];
  const isCompleted = task.status === 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`flex items-start gap-3 rounded-2xl border p-4 shadow-sm
        ${isCompleted ? 'border-gray-100 bg-gray-50 opacity-60' : 'border-gray-100 bg-white'}
        ${urgencyStyle.border} border-l-4`}
    >
      <button
        onClick={() => onComplete(task.id)}
        className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors
          ${isCompleted
            ? 'border-green-500 bg-green-500'
            : 'border-gray-300 hover:border-green-400'
          }`}
        aria-label={isCompleted ? 'Reabrir tarea' : 'Completar tarea'}
      >
        {isCompleted && (
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <button onClick={() => onEdit(task)} className="flex-1 min-w-0 text-left">
        <h3 className={`text-sm font-medium text-gray-900 truncate ${isCompleted ? 'line-through' : ''}`}>
          {task.title}
        </h3>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          {difficulty && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${difficulty.bgColor} ${difficulty.textColor}`}>
              {difficulty.label}
            </span>
          )}
          {task.due_date && (
            <span className={`text-xs ${urgencyStyle.text}`}>
              {formatDueDate(task.due_date)}
            </span>
          )}
          {task.estimated_minutes && (
            <span className="text-xs text-gray-400">{formatMinutes(task.estimated_minutes)}</span>
          )}
        </div>
      </button>

      {task.status === 'pending' && (
        <button
          onClick={(e) => { e.stopPropagation(); onStart(task.id); }}
          className="flex-shrink-0 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-600
            hover:bg-purple-100 transition-colors"
        >
          Empezar
        </button>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
        className="flex-shrink-0 rounded-lg p-1 text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Eliminar tarea"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </motion.div>
  );
}
