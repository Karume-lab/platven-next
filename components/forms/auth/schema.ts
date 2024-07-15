import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Passwod required" })
    .min(4, { message: "Invalid password" }),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Required"),
    email: z.string().email({ message: "Enter a valid email address" }),
    phoneNumber: z.coerce.number().refine((numb) => {
      const n = String(numb);
      return n.length === 9 && (n.startsWith("1") || n.startsWith("7"));
    }, "Invalid number, must follow 710000000"),
    type: z.enum(["Organization", "Individual"]),
    identificationNumber: z.string().min(1, "Required"),
    password: z
      .string()
      .min(1, { message: "Passwod required" })
      .min(4, { message: "Invalid password" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must much",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password required"),
    newPassword: z.string().min(1, "New password required"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords must much",
    path: ["confirmNewPassword"],
  });

export const requestSetPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(1, "New password Required"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords must much",
    path: ["confirmNewPassword"],
  });
