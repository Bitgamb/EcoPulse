import { z } from "zod";

const safeText = (minimum: number, maximum: number) => z.string().trim().min(minimum).max(maximum);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date");

export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .max(254)
    .transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Use at least 8 characters").max(128),
  name: safeText(2, 80).optional(),
});

export const entrySchema = z
  .object({
    category: z.enum(["transport", "electricity", "food", "shopping", "waste"]),
    activity_type: safeText(1, 60),
    value: z.coerce.number().finite().positive("Enter a value above zero").max(1_000_000),
    unit: safeText(1, 30),
    entry_date: isoDate,
    note: z.string().trim().max(300).optional(),
  })
  .refine((value) => value.entry_date <= new Date().toISOString().slice(0, 10), {
    message: "Date cannot be in the future",
    path: ["entry_date"],
  });

export const goalSchema = z.object({
  title: safeText(3, 100),
  target_reduction: z.coerce.number().finite().positive().max(1_000_000),
  deadline: isoDate.refine((value) => value > new Date().toISOString().slice(0, 10), "Choose a future date"),
  category: z.enum(["transport", "electricity", "food", "shopping", "waste"]).optional(),
});
