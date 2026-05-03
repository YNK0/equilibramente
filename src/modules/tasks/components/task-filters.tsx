'use client';

import { TASK_STATUS_LABELS } from '../constants';
import type { TaskStatus } from '../types';

interface Props {
  active: TaskStatus;
  counts: Record<TaskStatus, number>;
  onChange: (status: TaskStatus) => void;
}

export function TaskFilters({ active, counts, onChange }: Props) {
  const statuses: TaskStatus[] = ['pending', 'in_progress', 'completed'];

  return (
    <div className="flex rounded-xl bg-gray-100 p-1">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={`
            flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors
            focus:outline-none focus:ring-2 focus:ring-purple-200
            ${active === status
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          {TASK_STATUS_LABELS[status]}
          {counts[status] > 0 && (
            <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold
              ${active === status ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'}`}
            >
              {counts[status]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
