'use client';

import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/task-service';
import { triggerAnalysisRefresh } from '@/modules/analysis/services/analysis-trigger';
import type { Task, TaskInsert, TaskUpdate, TaskFilters, TaskStatus } from '../types';

export function useTasks(initialStatus: TaskStatus = 'pending') {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({ status: initialStatus });

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data, count: c } = await taskService.list(filters);
      setTasks(data);
      setCount(c);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (input: TaskInsert) => {
    const task = await taskService.create(input);
    triggerAnalysisRefresh();
    if (task.status === filters.status) {
      setTasks(prev => [task, ...prev]);
      setCount(c => c + 1);
    }
    return task;
  };

  const updateTask = async (id: string, input: TaskUpdate) => {
    const updated = await taskService.update(id, input);
    triggerAnalysisRefresh();
    if (updated.status === filters.status) {
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } else {
      setTasks(prev => prev.filter(t => t.id !== id));
      setCount(c => c - 1);
    }
    return updated;
  };

  const completeTask = async (id: string) => {
    const task = await taskService.complete(id);
    triggerAnalysisRefresh();
    if (filters.status === 'completed') {
      setTasks(prev => [task, ...prev]);
      setCount(c => c + 1);
    } else {
      setTasks(prev => prev.filter(t => t.id !== id));
      setCount(c => c - 1);
    }
    return task;
  };

  const removeTask = async (id: string) => {
    await taskService.remove(id);
    triggerAnalysisRefresh();
    setTasks(prev => prev.filter(t => t.id !== id));
    setCount(c => c - 1);
  };

  const setStatusFilter = (status: TaskStatus) => setFilters(prev => ({ ...prev, status }));

  return { tasks, count, loading, filters, fetch, create, updateTask, completeTask, removeTask, setStatusFilter };
}
