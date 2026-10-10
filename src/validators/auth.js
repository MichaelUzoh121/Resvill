import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("Please provide a valid email address");

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});