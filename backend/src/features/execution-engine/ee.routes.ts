import express from "express";
import ExecutionController from "./ee.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import { limiter } from "../../middlewares/ratelimit.middleware";

const router = express.Router();

router.post("/run", authMiddleware, limiter, ExecutionController.run);

export default router;
