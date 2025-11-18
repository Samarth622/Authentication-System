import express from "express";
import {
  login,
  refreshToken,
  registerUser,
  verifyOtp,
} from "../controllers/user.controllers.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

router.post("/refresh", refreshToken);

export default router;
