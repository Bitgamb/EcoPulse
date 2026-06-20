import { describe, expect, it } from "vitest";
import { generateInsights } from "@/lib/insights";
import type { CarbonEntry } from "@/types/carbon";
it("prioritizes the largest category", () => {
  const entries = [
    {
      id: "1",
      category: "electricity",
      activity_type: "ac_hour",
      value: 5,
      unit: "hours",
      co2_amount: 6,
      entry_date: "2026-06-19",
    },
    {
      id: "2",
      category: "food",
      activity_type: "vegetarian_meal",
      value: 1,
      unit: "meal",
      co2_amount: 1.5,
      entry_date: "2026-06-19",
    },
  ] as CarbonEntry[];
  expect(generateInsights(entries)[0].category).toBe("electricity");
  expect(generateInsights(entries)[0].priority).toBe("High");
});
