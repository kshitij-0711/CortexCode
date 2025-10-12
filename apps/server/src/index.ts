import express from "express";
import mongoose from "mongoose";
import config from "./config";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";
import reviewRouter from "./routes/reviewRoutes";
import cors from "cors";

mongoose
  .connect(config.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

const allowedOrigins = [
  "http://localhost:5173",                // local dev frontend
  "https://cortex-code-client.vercel.app" // production frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("🚫 Blocked CORS for origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/review", reviewRouter);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
