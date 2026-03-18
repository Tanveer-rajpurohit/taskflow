import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import connectDB from "./config/db";

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


// app.use("/api", rateLimiter);

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Backend running on port ${PORT}`)
  );
});
 
export default app;