"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { demoActions,demoEntries,demoGoals } from "@/lib/demo-data";
import type { CarbonEntry,EcoAction,Goal } from "@/types/carbon";
type State={entries:CarbonEntry[];actions:EcoAction[];goals:Goal[];streak:number;addEntry:(e:CarbonEntry)=>void;completeAction:(id:string)=>void;addGoal:(g:Goal)=>void;deleteGoal:(id:string)=>void;reset:()=>void};
const C = createContext<State | null>(null);
const DEMO_KEY = "ecopulse-data";
const USER_KEY = "ecopulse-user-data";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CarbonEntry[]>([]);
  const [actions, setActions] = useState<EcoAction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [mode, setMode] = useState<"loading" | "demo" | "local" | "supabase">("loading");

  useEffect(() => {
    const demo = document.cookie.includes("ecopulse-demo=true");
    const local = document.cookie.includes("ecopulse-local=true");
    if (demo || local) {
      const storageKey = demo ? DEMO_KEY : USER_KEY;
      const defaults = demo
        ? { entries: demoEntries, actions: demoActions, goals: demoGoals }
        : { entries: [], actions: demoActions.map((action) => ({ ...action, completed: false })), goals: [] };
      try {
        const stored = localStorage.getItem(storageKey);
        const data = stored ? JSON.parse(stored) : defaults;
        setEntries(data.entries || []);
        setActions(data.actions?.length ? data.actions : defaults.actions);
        setGoals(data.goals || []);
      } catch {
        setEntries(defaults.entries);
        setActions(defaults.actions);
        setGoals(defaults.goals);
      }
      setMode(demo ? "demo" : "local");
      return;
    }

    setMode("supabase");
    Promise.all([fetch("/api/entries"), fetch("/api/actions"), fetch("/api/goals")]).then(async (responses) => {
      const values = await Promise.all(responses.map((response) => response.json()));
      if (values[0].data) setEntries(values[0].data);
      if (values[1].data) setActions(values[1].data);
      if (values[2].data) setGoals(values[2].data);
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (mode !== "demo" && mode !== "local") return;
    localStorage.setItem(mode === "demo" ? DEMO_KEY : USER_KEY, JSON.stringify({ entries, actions, goals }));
  }, [entries, actions, goals, mode]);

  const value = useMemo(() => ({
    entries,
    actions,
    goals,
    streak: mode === "demo" ? 8 : entries.length ? 1 : 0,
    addEntry: (entry: CarbonEntry) => {
      setEntries((current) => [entry, ...current]);
      if (mode === "supabase") fetch("/api/entries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(entry) });
    },
    completeAction: (id: string) => {
      const completedAction = actions.find((action) => action.id === id && !action.completed);
      setActions((current) => current.map((action) => action.id === id ? { ...action, completed: true } : action));
      if (completedAction) {
        setGoals((current) => current.map((goal) => {
          if (goal.status !== "active" || (goal.category && goal.category !== completedAction.category)) return goal;
          const current_progress = Math.min(goal.target_reduction, goal.current_progress + completedAction.estimated_saving);
          return { ...goal, current_progress, status: current_progress >= goal.target_reduction ? "completed" as const : goal.status };
        }));
      }
      if (mode === "supabase") fetch("/api/actions", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
    },
    addGoal: (goal: Goal) => {
      setGoals((current) => [goal, ...current]);
      if (mode === "supabase") fetch("/api/goals", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(goal) });
    },
    deleteGoal: (id: string) => {
      setGoals((current) => current.filter((goal) => goal.id !== id));
      if (mode === "supabase") fetch(`/api/goals?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    },
    reset: () => {
      if (mode === "demo") {
        setEntries(demoEntries); setActions(demoActions); setGoals(demoGoals);
      } else {
        setEntries([]); setActions(demoActions.map((action) => ({ ...action, completed: false }))); setGoals([]);
      }
    },
  }), [entries, actions, goals, mode]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export const useEcoData = () => {
  const context = useContext(C);
  if (!context) throw new Error("DataProvider missing");
  return context;
};
