import { describe, expect, it, vi } from "vitest";
import { authSchema, entrySchema, goalSchema } from "@/lib/validations";

describe("request validation", () => {
  it("normalizes valid account data", () => {
    const result = authSchema.parse({
      name: "  Asha Rao  ",
      email: "  ASHA@EXAMPLE.COM ",
      password: "correct horse battery staple",
    });
    expect(result).toMatchObject({ name: "Asha Rao", email: "asha@example.com" });
  });

  it("rejects oversized credentials", () => {
    expect(() => authSchema.parse({ email: "a@example.com", password: "x".repeat(129) })).toThrow();
  });

  it("rejects invalid activity values and future dates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-20T12:00:00Z"));
    const base = {
      category: "transport",
      activity_type: "car_km",
      value: 10,
      unit: "km",
      entry_date: "2026-06-20",
    };
    expect(entrySchema.safeParse(base).success).toBe(true);
    expect(entrySchema.safeParse({ ...base, value: -1 }).success).toBe(false);
    expect(entrySchema.safeParse({ ...base, entry_date: "2026-06-21" }).success).toBe(false);
    vi.useRealTimers();
  });

  it("requires positive goals with future deadlines", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-20T12:00:00Z"));
    expect(
      goalSchema.safeParse({ title: "Save energy", target_reduction: 5, deadline: "2026-07-20" }).success,
    ).toBe(true);
    expect(goalSchema.safeParse({ title: "No", target_reduction: 0, deadline: "2026-06-20" }).success).toBe(
      false,
    );
    vi.useRealTimers();
  });
});
