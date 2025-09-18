import express from "express";
import mongoose from "mongoose";
import config from "./config";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";
import reviewRouter from "./routes/reviewRoutes";
import cors from 'cors';

mongoose.connect(config.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
});

const app = express();

// ✅ CORS must come first
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// 🔍 Add debug middleware to see all requests
app.use((req, res, next) => {
  console.log(`\n🔍 ${req.method} ${req.url}`);
  console.log('Cookies:', req.cookies);
  console.log('Headers:', req.headers);
  next();
});

// 🔍 Add debug route
app.get("/api/debug", (req, res) => {
  res.json({
    cookies: req.cookies,
    hasToken: !!req.cookies.token,
    headers: req.headers
  });
});

app.use("/api/auth", authRouter);
app.use("/api/review", reviewRouter);

app.listen(config.port, () => console.log(`Server running on port ${config.port}`));