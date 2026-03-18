import { useCallback } from 'react';
import { taskService } from '../services/task.service';
import { useTaskStore } from '../store/useTaskStore';
import { useToastStore } from '../store/useToastStore';
import type { ITask, TaskOperation } from '../types';

export interface CreateTaskData {
  title: string;
  inputText: string;
  operation: TaskOperation;
}

export const useTasks = () => {
  const { tasks, isLoading, error, setTasks, upsertTask, removeTask, setLoading, setError } =
    useTaskStore();
  const { showToast } = useToastStore();

  const fetchTasks = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskService.getTasks();
      if (res.success) {
        setTasks(res.tasks);
      }
    } catch (err: unknown) {
      let message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      if (message.startsWith('RATE_LIMIT:')) {
        message = message.replace('RATE_LIMIT:', '');
        showToast(message, 'error');
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [setTasks, setLoading, setError]);

  const getTaskById = useCallback(
    async (id: string): Promise<ITask | null> => {
      try {
        const res = await taskService.getTaskById(id);
        if (res.success) {
          upsertTask(res.task);
          return res.task;
        }
        return null;
      } catch (err: unknown) {
        let message = err instanceof Error ? err.message : 'Failed to fetch task';
        const isRateLimit = message.startsWith('RATE_LIMIT:');
        if (isRateLimit) {
          message = message.replace('RATE_LIMIT:', '');
          showToast(message, 'error');
        }
        setError(message);
        return null;
      }
    },
    [upsertTask, setError, showToast]
  );

  const createTask = useCallback(
    async (data: CreateTaskData): Promise<ITask | null> => {
      try {
        setLoading(true);
        setError(null);
        const res = await taskService.createTask(data);
        if (res.success) {
          upsertTask(res.task);
          return res.task;
        }
        return null;
      } catch (err: unknown) {
        let message = err instanceof Error ? err.message : 'Failed to create task';
        if (message.startsWith('RATE_LIMIT:')) message = message.replace('RATE_LIMIT:', '');
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [upsertTask, setLoading, setError]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        const res = await taskService.deleteTask(id);
        if (res.success) {
          removeTask(id);
          return true;
        }
        return false;
      } catch (err: unknown) {
        let message = err instanceof Error ? err.message : 'Failed to delete task';
        if (message.startsWith('RATE_LIMIT:')) message = message.replace('RATE_LIMIT:', '');
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [removeTask, setLoading, setError]
  );

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    deleteTask,
    getTaskById,
  };
};
