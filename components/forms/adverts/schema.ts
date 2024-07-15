import { z } from "zod";

export const advertValidationSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
});
