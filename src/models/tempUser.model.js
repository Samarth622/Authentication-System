import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    avatar: String,
  },
  { timestamps: true }
);

// Auto delete temp user after 10 mins
tempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export default mongoose.model("TempUser", tempUserSchema);
