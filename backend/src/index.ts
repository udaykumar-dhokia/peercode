import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import connectDB from "./config/db.config";
import AuthRoutes from "./features/auth/auth.routes";
import cookieParser from "cookie-parser";
import UserRoutes from "./features/user/user.routes";
import QuestionRoute from "./features/question/question.routes";
import ChallengeRoute from "./features/challenge/challlenge.routes";
import ExecutionRoutes from "./features/execution-engine/ee.routes";

// Constant variables
const PORT: number = parseInt(process.env.PORT, 10);
const allowedOrigins = ["http://localhost:5173"];

// Express instance
const app = express();

// app.use();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// app routes
app.get("/", (req, res) => {
  return res.status(200).json({ message: "🔥Server is up and running.." });
});

app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/question", QuestionRoute);
app.use("/api/challenge", ChallengeRoute);
app.use("/api/execute", ExecutionRoutes);

// Server
const server = http.createServer(app);

// Spinning up the server
server.listen(PORT, async () => {
  connectDB();
  console.log("🔥Server is up and running..");
});
