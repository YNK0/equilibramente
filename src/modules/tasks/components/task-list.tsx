'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { PageLoading } from '@/modules/shared/components/ui/loading';
import { useTasks } from '../hooks/use-tasks';
import type { Task, TaskFormData, TaskInsert } from '../types';
import { MiniLoadIndicator } from './mini-load-indicator';
import { TaskCard } from './task-card';
import { TaskEmpty } from './task-empty';
import { TaskFilters } from './task-filters';
import { TaskForm } from './task-form';

export function TaskList() {
  const {
    tasks,
    count,
    loading,
    create,
    updateTask,
    completeTask,
    removeTask,
    setStatusFilter,
    filters,
  } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreate = useCallback(
    async (data: TaskFormData) => {
      await create({
        title: data.title,
        difficulty: data.difficulty || 'medium',
        due_date: data.due_date,
        estimated_minutes: data.estimated_minutes,
        description: data.description,
        status: 'pending',
      } as TaskInsert);
      setShowForm(false);
    },
    [create]
  );

  const handleUpdate = useCallback(
    async (data: TaskFormData) => {
      if (!editingTask) return;
      await updateTask(editingTask.id, {
        title: data.title,
        difficulty: data.difficulty || undefined,
        due_date: data.due_date ?? undefined,
        estimated_minutes: data.estimated_minutes ?? undefined,
        description: data.description ?? undefined,
      });
      setEditingTask(null);
    },
    [editingTask, updateTask]
  );

  const handleStart = useCallback(
    async (id: string) => {
      await updateTask(id, { status: 'in_progress' });
    },
    [updateTask]
  );

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      // Simple delete — no confirmation dialog in MVP
      await removeTask(id);
    },
    [removeTask]
  );

  const counts = { pending: 0, in_progress: 0, completed: 0, cancelled: 0 };
  counts[filters.status] = count;

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-4 py-3">
        <MiniLoadIndicator loadLevel="low" percentage={30} />
      </div>

      <div className="px-4 pb-3">
        <TaskFilters active={filters.status} counts={counts} onChange={setStatusFilter} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {loading ? (
          <PageLoading />
        ) : tasks.length === 0 ? (
          <TaskEmpty
            hasFilter={filters.status !== 'pending'}
            onCreateTask={() => setShowForm(true)}
          />
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="flex flex-col gap-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStart={handleStart}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end bg-black/40"
            onClick={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg mx-auto rounded-t-3xl bg-white px-4 py-6 pb-10 shadow-lg"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingTask ? 'Editar tarea' : 'Nueva tarea'}
              </h2>
              <TaskForm
                initialData={
                  editingTask
                    ? {
                        title: editingTask.title,
                        difficulty: editingTask.difficulty as TaskFormData['difficulty'],
                        due_date: editingTask.due_date,
                        estimated_minutes: editingTask.estimated_minutes,
                        description: editingTask.description,
                      }
                    : undefined
                }
                onSubmit={editingTask ? handleUpdate : handleCreate}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <button
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full
            bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-colors
            focus:outline-none focus:ring-2 focus:ring-purple-400"
          aria-label="Crear nueva tarea"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
