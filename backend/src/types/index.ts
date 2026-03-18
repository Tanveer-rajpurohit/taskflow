import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export type TaskStatus = "pending" | "running" | "success" | "failed";
export type TaskOperation = "uppercase" | "lowercase" | "reverse" | "word_count";

export interface TaskJobPayload {
  taskId: string;
  userId: string;
  operation: TaskOperation;
  inputText: string;
}