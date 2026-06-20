import { describe, expect, it } from "vitest";
import {
  calculateEcoScore,
  calculateGoalProgress,
  calculateMonthlyTotal,
  calculateWeeklyTotal,
  getBiggestEmissionCategory,
} from "@/lib/calculations";
import { calculateCO2 } from "@/lib/emission-factors";
import type { CarbonEntry } from "@/types/carbon";

const entry = (
  id: string,
  category: CarbonEntry["category"],
  amount: number,
  date = "2026-06-20",
): CarbonEntry => ({
  id,
  category,
  activity_type: "test",
  value: 1,
  unit: "item",
  co2_amount: amount,
  entry_date: date,
});

describe("carbon calculations", () => {
  it("calculates common activities and avoided emissions", () => {
    expect(calculateCO2("car_km", 10)).toBe(1.92);
    expect(calculateCO2("vegetarian_meal", 2)).toBe(3);
    expect(calculateCO2("recycled_waste_kg", 2)).toBe(-1);
  });

  it("finds the category with the largest positive footprint", () => {
    expect(
      getBiggestEmissionCategory([entry("1", "food", 3), entry("2", "transport", 8), entry("3", "food", 2)]),
    ).toBe("transport");
  });

  it("uses deterministic rolling weekly and monthly periods", () => {
    const entries = [
      entry("1", "transport", 2, "2026-06-20"),
      entry("2", "food", 3, "2026-06-14"),
      entry("3", "food", 5, "2026-05-22"),
      entry("4", "food", 7, "2026-05-21"),
    ];
    const now = new Date("2026-06-20T12:00:00+05:30");
    expect(calculateWeeklyTotal(entries, now)).toBe(5);
    expect(calculateMonthlyTotal(entries, now)).toBe(10);
  });

  it("bounds scores and goal progress", () => {
    expect(calculateEcoScore(500)).toBe(0);
    expect(calculateEcoScore(0, 10, 20)).toBe(100);
    expect(calculateGoalProgress(12, 10)).toBe(100);
    expect(calculateGoalProgress(1, 0)).toBe(0);
  });
});
