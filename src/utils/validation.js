import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .regex(/^[a-zA-Z ]{3,16}$/, "Name consist only alphates with length 3-16"),
  email: z
    .string()
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
