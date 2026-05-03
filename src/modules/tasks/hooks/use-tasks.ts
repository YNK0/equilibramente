'use client';

import { useCallback, useEffect, useState } from 'react';
import { isOnline, offlineDB } from '@/lib/offline-db';
import { triggerDataChanged } from '@/modules/analysis/services/analysis-trigger';
import { taskService } from '../services/task-service';
import type { Task, TaskFilters, TaskInsert, TaskStatus, TaskUpdate } from '../types';

export function useTasks(initialStatus: TaskStatus = 'pending') {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({ status: initialStatus });

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data, count: c } = await taskService.list(filters);
      setTasks(data);
      setCount(c);
      setOffline(false);
    } catch {
      const cached = await offlineDB.getAll<Task>('tasks');
      const filtered = cached.filter((t) => t.status === filters.status);
      setTasks(filtered);
      setCount(filtered.length);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Periodically sync pending mutations when back online
  useEffect(() => {
    const handleOnline = () => {
      offlineDB.syncPendingMutations().then(() => fetch());
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [fetch]);

  const create = async (input: TaskInsert) => {
    const offlineId = `offline-task-${Date.now()}`;
    const optimistic: Task = {
      id: offlineId,
      ...input,
      user_id: '',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Task;

    if (!isOnline()) {
      await offlineDB.put('tasks', optimistic as unknown as Record<string, unknown>);
      await offlineDB.addMutation({ endpoint: '/api/tasks', method: 'POST', body: input });
      if (filters.status === 'pending') {
        setTasks((prev) => [optimistic, ...prev]);
        setCount((c) => c + 1);
      }
      setOffline(true);
      return optimistic;
    }

    try {
      const task = await taskService.create(input);
      triggerDataChanged();
      await offlineDB.put('tasks', task as unknown as Record<string, unknown>);
      if (task.status === filters.status) {
        setTasks((prev) => [task, ...prev]);
        setCount((c) => c + 1);
      }
      return task;
    } catch {
      await offlineDB.put('tasks', optimistic as unknown as Record<string, unknown>);
      await offlineDB.addMutation({ endpoint: '/api/tasks', method: 'POST', body: input });
      if (filters.status === 'pending') {
        setTasks((prev) => [optimistic, ...prev]);
        setCount((c) => c + 1);
      }
      setOffline(true);
      return optimistic;
    }
  };

  const updateTask = async (id: string, input: TaskUpdate) => {
    try {
      const updated = await taskService.update(id, input);
      triggerDataChanged();
      if (updated.status === filters.status) {
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } else {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setCount((c) => c - 1);
      }
      return updated;
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? ({ ...t, ...input, updated_at: new Date().toISOString() } as Task) : t
        )
      );
      if (!isOnline()) {
        await offlineDB.addMutation({ endpoint: `/api/tasks/${id}`, method: 'PATCH', body: input });
      }
      return tasks.find((t) => t.id === id)!;
    }
  };

  const completeTask = async (id: string) => {
    try {
      const task = await taskService.complete(id);
      triggerDataChanged();
      if (filters.status === 'completed') {
        setTasks((prev) => [task, ...prev]);
        setCount((c) => c + 1);
      } else {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setCount((c) => c - 1);
      }
      return task;
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? ({
                ...t,
                status: 'completed' as TaskStatus,
                updated_at: new Date().toISOString(),
              } as Task)
            : t
        )
      );
      if (!isOnline()) {
        await offlineDB.addMutation({
          endpoint: `/api/tasks/${id}/complete`,
          method: 'POST',
          body: {},
        });
      }
      return tasks.find((t) => t.id === id)!;
    }
  };

  const removeTask = async (id: string) => {
    try {
      await taskService.remove(id);
      triggerDataChanged();
    } catch {
      // Already removed optimistically
    }
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setCount((c) => c - 1);
  };

  const setStatusFilter = (status: TaskStatus) => setFilters((prev) => ({ ...prev, status }));

  return {
    tasks,
    count,
    loading,
    offline,
    filters,
    fetch,
    create,
    updateTask,
    completeTask,
    removeTask,
    setStatusFilter,
  };
}
