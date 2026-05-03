import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import type { PendingTask } from '../types';

interface Props {
  tasks: PendingTask[];
  total: number;
}

const difficultyColors: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

export function PendingTasksPreview({ tasks, total }: Props) {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Tareas pendientes</h3>
        {total > 0 && (
          <Link href="/tareas" className="text-xs text-purple-600 hover:text-purple-700">
            Ver todas ({total})
          </Link>
        )}
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-2">Sin tareas pendientes</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <AlertCircle className={`w-4 h-4 flex-shrink-0 ${task.difficulty === 'high' ? 'text-red-500' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-700 flex-1 truncate">{task.title}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${difficultyColors[task.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                {task.difficulty}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
