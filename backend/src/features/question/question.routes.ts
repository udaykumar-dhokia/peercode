import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import QuestionController from "./question.controller";
const router = express.Router();

router.get("/create", authMiddleware, QuestionController.create);
router.get("/get/:id", authMiddleware, QuestionController.get);

export default router;
