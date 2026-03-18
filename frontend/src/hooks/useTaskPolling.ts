import { useEffect, useRef } from 'react';
import { taskService } from '../services/task.service';
import { useTaskStore } from '../store/useTaskStore';
import type { TaskStatus } from '../types';

const ACTIVE_STATUSES: TaskStatus[] = ['pending', 'running'];
const POLL_INTERVAL_MS = 3000;

/**
 * Polls GET /tasks/:id every 3 seconds while the task is pending or running.
 * Automatically stops when the task reaches a terminal state (success/failed).
 */
export const useTaskPolling = (taskId: string | null, currentStatus?: TaskStatus): void => {
  const { upsertTask } = useTaskStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isActive = currentStatus ? ACTIVE_STATUSES.includes(currentStatus) : false;

  useEffect(() => {
    if (!taskId || !isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const poll = async (): Promise<void> => {
      try {
        const res = await taskService.getTaskById(taskId);
        if (res.success) {
          upsertTask(res.task);
          // Stop polling if terminal
          if (!ACTIVE_STATUSES.includes(res.task.status)) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }
      } catch {
        // Silently fail — don't surface polling errors to user
      }
    };

    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [taskId, isActive, upsertTask]);
};
