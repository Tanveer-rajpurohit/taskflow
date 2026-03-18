import { create } from 'zustand';
import type { ITask } from '../types';

interface TaskState {
  tasks: ITask[];
  isLoading: boolean;
  error: string | null;
  // Actions
  setTasks: (tasks: ITask[]) => void;
  upsertTask: (task: ITask) => void;
  removeTask: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),

  // Adds a new task OR updates an existing one (used by create + polling)
  upsertTask: (task) =>
    set((state) => {
      const exists = state.tasks.some((t) => t._id === task._id);
      if (exists) {
        return { tasks: state.tasks.map((t) => (t._id === task._id ? task : t)) };
      }
      return { tasks: [task, ...state.tasks] };
    }),

  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t._id !== id) })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
