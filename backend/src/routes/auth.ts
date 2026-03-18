import { Router } from "express";
import { register, login, getMe } from "../controllers/authcontroller";
import authMiddleware from "../middleware/auth";
import { authRateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.get("/me", authMiddleware, getMe);

export default router;