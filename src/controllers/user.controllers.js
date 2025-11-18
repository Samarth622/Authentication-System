import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { loginSchema, registerSchema } from "../utils/validation.js";
import User from "../models/user.model.js";
import TempUser from "../models/tempUser.model.js";
import { generateOTP } from "../utils/generateOTP.js";
import OTP from "../models/otp.model.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";
import {
  generateAcessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const validatedData = registerSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        status: "error",
        errors: validatedData.error.errors.map((e) => e.message),
      });
    }

    const { name, email, password } = validatedData.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Avatar file is required",
      });
    }

    let avatarUrl = null;

    const uploadedAvatarUrl = await uploadToCloudinary(req.file.buffer);
    avatarUrl = uploadedAvatarUrl.secure_url;

    const newUser = await TempUser.create({
      name,
      email,
      password,
      avatar: avatarUrl,
    });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await OTP.create({
      email,
      otp: hashedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await sendEmail(
      email,
      "Verify Your Email",
      `Your OTP is: ${otp}. Valid for 5 minutes.`
    );

    return res.status(200).json({
      status: "success",
      message: "OTP sent to your email. Please verify.",
      tempUserId: newUser._id,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) return res.status(400).json({ message: "OTP not found" });

    if (otpRecord.expiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    const isValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

    const tempUser = await TempUser.findOne({ email });
    if (!tempUser)
      return res.status(400).json({ message: "Temp user not found" });

    const newUser = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      avatar: tempUser.avatar,
      isVerified: true,
    });

    await OTP.deleteMany({ email });
    await TempUser.deleteMany({ email });

    return res.json({
      status: "success",
      message: "OTP verified, user registered",
      user: newUser,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {

    const validatedData = loginSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        status: "error",
        error: "Invalid input data",
      });
    }

    const { email, password } = validatedData.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAcessToken(user._id, user.role);

    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken.push(refreshToken);
    await user.save();

    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    user.password = undefined;

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      accessToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};
