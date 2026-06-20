import { z } from "zod";
export const authSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
  name: z.string().min(2).optional(),
});
export const entrySchema = z.object({
  category: z.enum(["transport", "electricity", "food", "shopping", "waste"]),
  activity_type: z.string().min(1),
  value: z.coerce.number().positive("Enter a value above zero"),
  unit: z.string().min(1),
  entry_date: z.string().min(1),
  note: z.string().max(300).optional(),
});
export const goalSchema = z.object({
  title: z.string().min(3),
  target_reduction: z.coerce.number().positive(),
  deadline: z.string().refine((v) => new Date(v) > new Date(), "Choose a future date"),
  category: z.string().optional(),
});
