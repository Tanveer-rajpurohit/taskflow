import { Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { rateLimiterRedis } from "../config/redis";
import { AuthRequest } from "../types";

// Global API limiter — 2000 requests per 60s per IP
const apiLimiter = new RateLimiterRedis({
  storeClient: rateLimiterRedis,
  keyPrefix: "rl_api",
  points: Number(process.env.RATE_LIMIT_POINTS) || 2000,
  duration: Number(process.env.RATE_LIMIT_DURATION) || 60,
  blockDuration: 1,
});

// Auth limiter — 10 attempts per 1 minute per IP 
const authLimiter = new RateLimiterRedis({
  storeClient: rateLimiterRedis,
  keyPrefix: "rl_auth",
  points: 10,
  duration: 60,
  blockDuration: 60,
});

const makeMiddleware =
  (rl: RateLimiterRedis) =>
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const key = req.ip ?? "unknown";
    try {
      const result = await rl.consume(key);
      res.setHeader("X-RateLimit-Remaining", result.remainingPoints);
      res.setHeader(
        "X-RateLimit-Reset",
        new Date(Date.now() + result.msBeforeNext).toISOString()
      );
      next();
    } catch (err: unknown) {
      const msBeforeNext =
        err && typeof err === "object" && "msBeforeNext" in err
          ? (err as { msBeforeNext: number }).msBeforeNext
          : 30000;
      res.setHeader("Retry-After", Math.ceil(msBeforeNext / 1000));
      res.status(429).json({
        success: false,
        message: "Too many requests. Please slow down.",
        retryAfterSeconds: Math.ceil(msBeforeNext / 1000),
      });
    }
  };

export const rateLimiter = makeMiddleware(apiLimiter);
export const authRateLimiter = makeMiddleware(authLimiter);