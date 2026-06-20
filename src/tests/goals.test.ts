import { describe, expect, it } from "vitest";
import { advanceGoals } from "@/lib/goals";
import type { EcoAction, Goal } from "@/types/carbon";

const action: EcoAction = {
  id: "action-1",
  title: "Use the metro",
  description: "Replace one car trip",
  category: "transport",
  estimated_saving: 2,
  difficulty: "Easy",
  completed: false,
};

const goal = (overrides: Partial<Goal> = {}): Goal => ({
  id: "goal-1",
  title: "Save 5 kg",
  category: null,
  target_reduction: 5,
  current_progress: 1,
  deadline: "2026-07-20",
  status: "active",
  ...overrides,
});

describe("goal progression", () => {
  it("advances active matching goals", () => {
    expect(advanceGoals([goal()], action)[0].current_progress).toBe(3);
  });

  it("does not advance another category or a completed goal", () => {
    const goals = [goal({ category: "food" }), goal({ id: "goal-2", status: "completed" })];
    expect(advanceGoals(goals, action)).toEqual(goals);
  });

  it("caps progress and marks a goal complete", () => {
    const result = advanceGoals([goal({ current_progress: 4 })], action)[0];
    expect(result.current_progress).toBe(5);
    expect(result.status).toBe("completed");
  });
});
