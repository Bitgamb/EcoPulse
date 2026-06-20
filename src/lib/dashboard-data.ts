import "server-only";

import { cookies } from "next/headers";
import { demoActions, demoEntries, demoGoals } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import type { CarbonEntry, DashboardData, EcoAction, Goal } from "@/types/carbon";

const ENTRY_COLUMNS = "id,category,activity_type,value,unit,co2_amount,entry_date,note";
const ACTION_COLUMNS = "id,title,description,category,estimated_saving,difficulty,completed";
const GOAL_COLUMNS = "id,title,category,target_reduction,current_progress,deadline,status";

const emptyData = (mode: DashboardData["mode"], error?: string): DashboardData => ({
  entries: [],
  actions: [],
  goals: [],
  mode,
  error,
});

export async function loadDashboardData(): Promise<DashboardData> {
  const cookieStore = await cookies();
  if (cookieStore.get("ecopulse-demo")?.value === "true") {
    return { entries: demoEntries, actions: demoActions, goals: demoGoals, mode: "demo" };
  }

  const supabase = await createClient();
  if (!supabase) return emptyData("supabase", "Supabase is not configured.");

  const [entriesResult, actionsResult, goalsResult] = await Promise.all([
    supabase
      .from("carbon_entries")
      .select(ENTRY_COLUMNS)
      .order("entry_date", { ascending: false })
      .limit(100),
    supabase.from("eco_actions").select(ACTION_COLUMNS).order("created_at", { ascending: false }),
    supabase.from("goals").select(GOAL_COLUMNS).order("deadline", { ascending: true }),
  ]);

  if (entriesResult.error || actionsResult.error || goalsResult.error) {
    return emptyData(
      "supabase",
      "Dashboard data could not be loaded. Verify that the Supabase migrations have been applied.",
    );
  }

  return {
    entries: (entriesResult.data ?? []) as CarbonEntry[],
    actions: (actionsResult.data ?? []) as EcoAction[],
    goals: (goalsResult.data ?? []) as Goal[],
    mode: "supabase",
  };
}
