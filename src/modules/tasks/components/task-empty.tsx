import { ListChecks } from 'lucide-react';

interface Props {
  hasFilter: boolean;
  onCreateTask: () => void;
}

export function TaskEmpty({ hasFilter, onCreateTask }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 mb-4">
        <ListChecks className="h-8 w-8 text-purple-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">
        {hasFilter ? 'No hay tareas con ese filtro' : 'No tienes tareas'}
      </h3>
      <p className="mt-1 text-sm text-gray-500 max-w-xs">
        {hasFilter
          ? 'Cambia el filtro para ver otras tareas.'
          : 'Crea tu primera tarea y empieza a organizar tu carga academica.'}
      </p>
      {!hasFilter && (
        <button
          onClick={onCreateTask}
          className="mt-6 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white
            shadow-sm hover:bg-purple-700 transition-colors"
        >
          Crear primera tarea
        </button>
      )}
    </div>
  );
}
