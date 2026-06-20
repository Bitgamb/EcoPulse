"use client";

import { useState } from "react";
import { Check, Clock, Leaf } from "lucide-react";
import { useEcoData } from "@/components/dashboard/data-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { pretty } from "@/lib/utils";

export function ActionsView() {
  const { actions, completeAction } = useEcoData();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const completed = actions.filter((action) => action.completed);
  const pending = actions.filter((action) => !action.completed);
  const saved = completed.reduce((total, action) => total + action.estimated_saving, 0);

  async function markComplete(id: string) {
    setPendingId(id);
    await completeAction(id);
    setPendingId(null);
  }

  return (
    <>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold text-emerald">YOUR WEEKLY PLAN</p>
          <h1 className="mt-1 font-display text-4xl">Eco actions</h1>
          <p className="mt-1 text-sm text-ink/55">Small, specific changes selected from your footprint.</p>
        </div>
        <div className="rounded-md bg-lime px-4 py-3">
          <strong>{saved.toFixed(1)} kg</strong>
          <span className="ml-2 text-xs">CO₂e saved</span>
        </div>
      </header>

      <div className="mt-8 flex gap-5 border-b border-ink/10 text-sm font-bold">
        <span className="border-b-2 border-ink pb-3">To do ({pending.length})</span>
        <span className="pb-3 text-ink/40">Completed ({completed.length})</span>
      </div>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        {[...pending, ...completed].map((action) => (
          <Card key={action.id} className={action.completed ? "bg-white/55" : ""}>
            <div className="flex items-start justify-between">
              <span className="grid size-10 place-items-center rounded-md bg-paper text-emerald">
                {action.completed ? <Check /> : <Leaf />}
              </span>
              <span className="rounded-md bg-paper px-2 py-1 text-xs font-bold">{action.difficulty}</span>
            </div>
            <h2 className={`mt-5 font-extrabold ${action.completed ? "line-through opacity-60" : ""}`}>
              {action.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/55">{action.description}</p>
            <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
              <div>
                <span className="block text-xs text-ink/45">Estimated saving</span>
                <strong className="text-emerald">{action.estimated_saving} kg</strong>
              </div>
              {action.completed ? (
                <span className="flex items-center gap-1 text-sm font-bold text-emerald">
                  <Check size={16} />
                  Completed
                </span>
              ) : (
                <Button
                  className="h-9 px-3"
                  disabled={pendingId === action.id}
                  onClick={() => markComplete(action.id)}
                >
                  {pendingId === action.id ? <Spinner /> : <Check size={15} />}
                  {pendingId === action.id ? "Saving" : "Mark done"}
                </Button>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-ink/40">
              <Clock size={13} />
              {pretty(action.category)} action
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}
