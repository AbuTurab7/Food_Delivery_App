import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(3, { message: "Name must be at least 3 characters long." })
  .max(100, { message: "Name must be no more than 100 characters." });

const emailSchema = z
  .email({ message: "Please enter a valid email address." })
  .trim()
  .max(100, { message: "Email must be no more than 100 characters." });

const passwordSchema = z
  .string()
  .trim()
  .min(6, { message: "Password must be at least 6 characters long." })
  .max(20, { message: "Password must be no more than 20 characters." });

export const loginValidation = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registrationValidation = loginValidation.extend({
  fullname: nameSchema,

  mobile: z.string().regex(/^\d{10}$/, "Invalid mobile number!"),

  role: z.string(),
});

export const sendOtpValidation = z.object({
  email: emailSchema,
});

export const verifyOtpValidation = z.object({
  email: emailSchema,

  otp: z
    .string()
    .trim()
    .min(6, { message: "Invalid OTP!" })
    .max(6, { message: "Invalid OTP!" }),
});

export const resetPasswordValidation = z
  .object({
    email: emailSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password does not match!",
  });
