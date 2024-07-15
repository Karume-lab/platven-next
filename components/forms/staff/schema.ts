import { z } from "zod";

export const staffFormSchema = z.object({
  isActive: z.boolean({ coerce: true }),
  name: z.string().min(1, { message: "Name required" }),
  email: z.string().email({ message: "Invalid email" }),
  phoneNumber: z.coerce.number().refine((numb) => {
    const n = String(numb);
    return n.length === 9 && (n.startsWith("1") || n.startsWith("7"));
  }, "Invalid number, must follow 710000000"),
  address: z.string().min(1, { message: "Address required" }),
  position: z.string().min(1, { message: "Position required" }),
  type: z.enum(["Organization", "Individual"]),
  identificationNumber: z.string().min(1, "Required"),
  isStaff: z.boolean(),
  isSuperUser: z.boolean()
});

export const userFormSchema = z.object({
  name: z.string().min(1, { message: "Name required" }).optional(),
  email: z.string().email({ message: "Invalid email" }).optional(),
  phoneNumber: z.coerce.number().refine((numb) => {
    const n = String(numb);
    return n.length === 9 && (n.startsWith("1") || n.startsWith("7"));
  }, "Invalid number, must follow 710000000"),
  address: z.string().min(1, { message: "Address required" }).optional(),
  isActive: z.boolean({ coerce: true }).optional(),
  type: z.enum(["Organization", "Individual"]),
  identificationNumber: z.string().min(1, "Required"),
});
