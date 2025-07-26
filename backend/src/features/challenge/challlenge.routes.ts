import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import ChallengeController from "./challenge.controller";
const router = express.Router();

router.post("/create", authMiddleware, ChallengeController.create);
router.get(
  "/get-user-challenges",
  authMiddleware,
  ChallengeController.getUserChallenges
);
router.post("/accept", authMiddleware, ChallengeController.accept);

export default router;
