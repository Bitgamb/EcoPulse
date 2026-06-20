import type { EcoAction, Goal } from "@/types/carbon";

export function advanceGoals(goals: Goal[], action: EcoAction): Goal[] {
  return goals.map((goal) => {
    if (goal.status !== "active" || (goal.category && goal.category !== action.category)) return goal;
    const currentProgress = Math.min(goal.target_reduction, goal.current_progress + action.estimated_saving);
    return {
      ...goal,
      current_progress: currentProgress,
      status: currentProgress >= goal.target_reduction ? "completed" : goal.status,
    };
  });
}
