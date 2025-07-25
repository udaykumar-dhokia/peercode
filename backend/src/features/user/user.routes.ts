import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import UserController from "./user.controller";
const router = express.Router();

router.get("/getdata", authMiddleware, UserController.getData);
router.get("/exists", authMiddleware, UserController.exists);

export default router;
