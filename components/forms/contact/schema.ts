import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name required" }),
  email: z.string().email(),
  phoneNumber: z.coerce.number().refine((numb) => {
    const n = String(numb);
    return n.length === 9 && (n.startsWith("1") || n.startsWith("7"));
  }, "Invalid number, must follow 710000000"),
  subject: z.string().min(1, { message: "Subject required" }),
  message: z.string().min(1, { message: "You must leave your message" }),
  isAddressed: z.boolean().optional(),
});
