import { fetchApi } from '../lib/fetch';
import type {
  ITask,
  TaskOperation,
  TasksResponse,
  SingleTaskResponse,
  DeleteTaskResponse,
} from '../types';

export interface CreateTaskPayload {
  title: string;
  inputText: string;
  operation: TaskOperation;
}

export type { ITask };

export const taskService = {
  getTasks: (): Promise<TasksResponse> =>
    fetchApi<TasksResponse>('/tasks', { method: 'GET' }),

  getTaskById: (id: string): Promise<SingleTaskResponse> =>
    fetchApi<SingleTaskResponse>(`/tasks/${id}`, { method: 'GET' }),

  createTask: (data: CreateTaskPayload): Promise<SingleTaskResponse> =>
    fetchApi<SingleTaskResponse>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteTask: (id: string): Promise<DeleteTaskResponse> =>
    fetchApi<DeleteTaskResponse>(`/tasks/${id}`, { method: 'DELETE' }),
};
