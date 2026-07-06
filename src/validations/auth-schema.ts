import { z } from "zod";

/**
 * Auth form schemas. These mirror the backend's Zod validation for each
 * endpoint so the client rejects the same input the server would. Login stays
 * lenient on the password (the server checks the credential); reset enforces a
 * minimum length since it sets a new one.
 */
export const loginSchema = z.object({
  email: z.string().trim().min(1, "Enter your email").email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const twoFactorSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code"),
});
export type TwoFactorValues = z.infer<typeof twoFactorSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Enter your email").email("Enter a valid email"),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Mirrors the backend `passwordField` policy (backend `auth-validation.ts`):
 * 8-128 chars including an uppercase letter, a lowercase letter, a number, and a
 * special character. `confirm` is client-only (the server takes just `password`).
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .max(128, "Use at most 128 characters")
      .regex(/[a-z]/, "Add a lowercase letter")
      .regex(/[A-Z]/, "Add an uppercase letter")
      .regex(/[0-9]/, "Add a number")
      .regex(/[^A-Za-z0-9]/, "Add a special character"),
    confirm: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
