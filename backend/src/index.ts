import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import connectDB from "./config/db";
import { rateLimiter } from "./middleware/rateLimiter";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";

const app = express();
const PORT = process.env.PORT || 5000;

//Security headers (helmet sets X-Frame-Options, CSP, HSTS, etc.)
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || "http://localhost:3000"
        : "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));

// Trust proxy (needed when behind Nginx/ingress for real IP)
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);


app.use("/api", rateLimiter);
 
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// 404 Not Found Handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled Global Error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});


connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Backend running on port ${PORT}`)
  );
});
 
export default app;