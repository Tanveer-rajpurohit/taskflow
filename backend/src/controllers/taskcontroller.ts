import { Response } from "express";
import Task from "../models/Task";
import { pushJob, removeJob } from "../config/redis";
import { AuthRequest, TaskOperation } from "../types";

const VALID_OPERATIONS: TaskOperation[] = [
  "uppercase",
  "lowercase",
  "reverse",
  "word_count",
];

// POST /api/tasks  — create task + push to Redis queue
export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, inputText, operation } = req.body;
    const userId = req.user!.userId;

    if (!title || !inputText || !operation) {
      res.status(400).json({ success: false, message: "title, inputText, and operation are required" });
      return;
    }

    if (!VALID_OPERATIONS.includes(operation)) {
      res.status(400).json({
        success: false,
        message: `operation must be one of: ${VALID_OPERATIONS.join(", ")}`,
      });
      return;
    }

    if (inputText.length > 50000) {
      res.status(400).json({ success: false, message: "inputText exceeds 50,000 character limit" });
      return;
    }

    const task = await Task.create({
      userId,
      title: title.trim(),
      inputText,
      operation,
      status: "pending",
      logs: [
        {
          timestamp: new Date(),
          message: `Task received — operation: ${operation}`,
          level: "info",
        },
        {
          timestamp: new Date(),
          message: "Validating input payload...",
          level: "info",
        },
      ],
    });

    // Push job to Redis queue — worker BLPOPs this
    await pushJob({
      taskId: task._id.toString(),
      userId,
      operation,
      inputText,
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    console.error("CreateTask error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/tasks 
export const getTasks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const tasks = await Task.find({ userId })
      .sort({ createdAt: -1 })
      .select("-inputText") // exclude large field from list view
      .limit(100);

    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    console.error("GetTasks error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/tasks/:id  — single task with full logs + result (used for polling)
export const getTaskById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.status(200).json({ success: true, task });
  } catch (err) {
    console.error("GetTaskById error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    if (task.status === "pending") {
      try {
        await removeJob({
          taskId: task._id.toString(),
          userId,
          operation: task.operation,
          inputText: task.inputText,
        });
      } catch (err) {
        console.error("Failed to remove job from Redis queue:", err);
      }
    }

    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (err) {
    console.error("DeleteTask error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};