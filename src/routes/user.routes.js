import express from "express";
import {
  login,
  logoutUser,
  refreshToken,
  registerUser,
  verifyOtp,
} from "../controllers/user.controllers.js";
import upload from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

router.post("/refresh", refreshToken);
router.post("/logout", authMiddleware, logoutUser);

export default router;
