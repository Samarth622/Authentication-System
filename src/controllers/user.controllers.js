import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { registerSchema } from "../utils/validation.js";
import User from "../models/user.model.js";

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

    const newUser = await User.create({
      name,
      email,
      password,
      avatar: avatarUrl,
    }).select("-password");

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: err.message,
    });
  }
};
