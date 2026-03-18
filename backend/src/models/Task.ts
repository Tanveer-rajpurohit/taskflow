import { Schema, model, Document, Types } from "mongoose";
import { TaskStatus, TaskOperation } from "../types";

export interface ITaskLog {
  timestamp: Date;
  message: string;
  level: "info" | "error" | "success";
}

export interface ITask extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  inputText: string;
  operation: TaskOperation;
  status: TaskStatus;
  result: string | null;
  logs: ITaskLog[];
  workerPid: number | null;
  startedAt: Date | null;
  completedAt: Date | null;
  durationMs: number | null;
  errorMessage: string | null;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskLogSchema = new Schema<ITaskLog>(
  {
    timestamp: { type: Date, default: Date.now },
    message: { type: String, required: true },
    level: {
      type: String,
      enum: ["info", "error", "success"],
      default: "info",
    },
  },
  { _id: false }
);

const TaskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    inputText: {
      type: String,
      required: true,
      maxlength: 50000,
    },
    operation: {
      type: String,
      enum: ["uppercase", "lowercase", "reverse", "word_count"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "running", "success", "failed"],
      default: "pending",
    },
    result: { type: String, default: null },
    logs: { type: [TaskLogSchema], default: [] },
    workerPid: { type: Number, default: null },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    durationMs: { type: Number, default: null },
    errorMessage: { type: String, default: null },
    retryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);


TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ status: 1, createdAt: 1 });


const Task = model<ITask>("Task", TaskSchema);
export default Task;