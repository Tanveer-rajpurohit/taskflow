// ─── Shared frontend types matching backend Mongoose model ───────────────────

export type TaskStatus = 'pending' | 'running' | 'success' | 'failed';
export type TaskOperation = 'uppercase' | 'lowercase' | 'reverse' | 'word_count';

export interface ITaskLog {
  timestamp: string;
  message: string;
  level: 'info' | 'error' | 'success';
}

export interface ITask {
  _id: string;
  userId: string;
  title: string;
  inputText?: string; // excluded from list view (GET /tasks), present in GET /tasks/:id
  operation: TaskOperation;
  status: TaskStatus;
  result: string | null;
  logs: ITaskLog[];
  workerPid: number | null;
  startedAt: string | null;
  completedAt: string | null;
  durationMs: number | null;
  errorMessage: string | null;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
}

// Auth payloads
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// API response wrappers
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: IUser;
}

export interface TasksResponse {
  success: boolean;
  count: number;
  tasks: ITask[];
}

export interface SingleTaskResponse {
  success: boolean;
  task: ITask;
}

export interface DeleteTaskResponse {
  success: boolean;
  message: string;
}
