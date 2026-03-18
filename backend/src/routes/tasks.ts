import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  deleteTask,
} from "../controllers/taskcontroller";
import authMiddleware from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.delete("/:id", deleteTask);

export default router;