import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string().min(1, { message: "Name required" }),
  email: z.string().email({ message: "Invalid email" }),
  phoneNumber: z.coerce.number().refine((numb) => {
    const n = String(numb);
    return n.length === 9 && (n.startsWith("1") || n.startsWith("7"));
  }, "Invalid number, must follow 710000000"),
  type: z.enum(["Organization", "Individual"]),
  identificationNumber: z.string().min(1, "Required"),
  address: z.string(),
});
