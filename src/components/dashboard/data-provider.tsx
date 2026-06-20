"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jsonRequest, requestJson } from "@/lib/api-client";
import { demoActions, demoEntries, demoGoals } from "@/lib/demo-data";
import { advanceGoals } from "@/lib/goals";
import type { CarbonEntry, DashboardData, EcoAction, Goal } from "@/types/carbon";

type EcoDataState = {
  entries: CarbonEntry[];
  actions: EcoAction[];
  goals: Goal[];
  streak: number;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  addEntry: (entry: CarbonEntry) => Promise<boolean>;
  completeAction: (id: string) => Promise<boolean>;
  addGoal: (goal: Goal) => Promise<boolean>;
  deleteGoal: (id: string) => Promise<boolean>;
  reset: () => void;
};

const EcoDataContext = createContext<EcoDataState | null>(null);
const DEMO_KEY = "ecopulse-data";

function readLocalData(key: string, fallback: Pick<DashboardData, "entries" | "actions" | "goals">) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored) as Partial<DashboardData>;
    return {
      entries: parsed.entries ?? fallback.entries,
      actions: parsed.actions?.length ? parsed.actions : fallback.actions,
      goals: parsed.goals ?? fallback.goals,
    };
  } catch {
    return fallback;
  }
}

export function DataProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: DashboardData;
}) {
  const [entries, setEntries] = useState(initialData.entries);
  const [actions, setActions] = useState(initialData.actions);
  const [goals, setGoals] = useState(initialData.goals);
  const [error, setError] = useState<string | null>(initialData.error ?? null);
  const [hydrated, setHydrated] = useState(initialData.mode === "supabase");
  const mode = initialData.mode;

  useEffect(() => {
    if (mode !== "demo") return;
    const fallback = { entries: demoEntries, actions: demoActions, goals: demoGoals };
    const data = readLocalData(DEMO_KEY, fallback);
    setEntries(data.entries);
    setActions(data.actions);
    setGoals(data.goals);
    setHydrated(true);
  }, [mode]);

  useEffect(() => {
    if (!hydrated || mode === "supabase") return;
    localStorage.setItem(DEMO_KEY, JSON.stringify({ entries, actions, goals }));
  }, [entries, actions, goals, hydrated, mode]);

  const value = useMemo<EcoDataState>(
    () => ({
      entries,
      actions,
      goals,
      streak: mode === "demo" ? 8 : entries.length ? 1 : 0,
      isLoading: !hydrated,
      error,
      clearError: () => setError(null),
      addEntry: async (entry) => {
        setError(null);
        setEntries((current) => [entry, ...current]);
        if (mode !== "supabase") return true;

        try {
          const saved = await requestJson<CarbonEntry>("/api/entries", jsonRequest("POST", entry));
          setEntries((current) => current.map((item) => (item.id === entry.id ? saved : item)));
          return true;
        } catch (cause) {
          setEntries((current) => current.filter((item) => item.id !== entry.id));
          setError(cause instanceof Error ? cause.message : "The activity could not be saved.");
          return false;
        }
      },
      completeAction: async (id) => {
        const action = actions.find((item) => item.id === id && !item.completed);
        if (!action) return true;
        const previousGoals = goals;
        setError(null);
        setActions((current) =>
          current.map((item) => (item.id === id ? { ...item, completed: true } : item)),
        );
        setGoals((current) => advanceGoals(current, action));
        if (mode !== "supabase") return true;

        try {
          await requestJson<EcoAction>("/api/actions", jsonRequest("PATCH", { id }));
          return true;
        } catch (cause) {
          setActions((current) =>
            current.map((item) => (item.id === id ? { ...item, completed: false } : item)),
          );
          setGoals(previousGoals);
          setError(cause instanceof Error ? cause.message : "The action could not be completed.");
          return false;
        }
      },
      addGoal: async (goal) => {
        setError(null);
        setGoals((current) => [goal, ...current]);
        if (mode !== "supabase") return true;

        try {
          const saved = await requestJson<Goal>("/api/goals", jsonRequest("POST", goal));
          setGoals((current) => current.map((item) => (item.id === goal.id ? saved : item)));
          return true;
        } catch (cause) {
          setGoals((current) => current.filter((item) => item.id !== goal.id));
          setError(cause instanceof Error ? cause.message : "The goal could not be created.");
          return false;
        }
      },
      deleteGoal: async (id) => {
        const deleted = goals.find((goal) => goal.id === id);
        if (!deleted) return true;
        setError(null);
        setGoals((current) => current.filter((goal) => goal.id !== id));
        if (mode !== "supabase") return true;

        try {
          await requestJson<boolean>(`/api/goals?id=${encodeURIComponent(id)}`, { method: "DELETE" });
          return true;
        } catch (cause) {
          setGoals((current) => [deleted, ...current]);
          setError(cause instanceof Error ? cause.message : "The goal could not be deleted.");
          return false;
        }
      },
      reset: () => {
        setError(null);
        if (mode === "supabase") {
          setError("Account data cannot be reset from this screen yet.");
          return;
        }
        setEntries(demoEntries);
        setActions(demoActions);
        setGoals(demoGoals);
      },
    }),
    [entries, actions, goals, hydrated, error, mode],
  );

  return <EcoDataContext.Provider value={value}>{children}</EcoDataContext.Provider>;
}

export function useEcoData() {
  const context = useContext(EcoDataContext);
  if (!context) throw new Error("useEcoData must be used within DataProvider");
  return context;
}
