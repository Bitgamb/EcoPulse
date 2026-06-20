"use client";

import { useState } from "react";
import { Calendar, Plus, Target, Trash2, X } from "lucide-react";
import { useEcoData } from "@/components/dashboard/data-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { calculateGoalProgress } from "@/lib/calculations";
import { goalSchema } from "@/lib/validations";
import type { Category } from "@/types/carbon";

export function GoalsView() {
  const { goals, addGoal, deleteGoal } = useEcoData();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const parsed = goalSchema.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the goal details.");
      return;
    }

    setSubmitting(true);
    const saved = await addGoal({
      id: crypto.randomUUID(),
      title: parsed.data.title,
      target_reduction: parsed.data.target_reduction,
      deadline: parsed.data.deadline,
      category: (parsed.data.category || null) as Category | null,
      current_progress: 0,
      status: "active",
    });
    setSubmitting(false);
    if (saved) setOpen(false);
    else setError("The goal could not be saved. Try again.");
  }

  async function removeGoal(id: string) {
    setDeletingId(id);
    await deleteGoal(id);
    setDeletingId(null);
  }

  return (
    <>
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold text-emerald">MAKE IT MEASURABLE</p>
          <h1 className="mt-1 font-display text-4xl">Reduction goals</h1>
          <p className="mt-1 text-sm text-ink/55">
            Set a target and let every completed action move it forward.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={17} />
          New goal
        </Button>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {goals.map((goal) => {
          const progress = calculateGoalProgress(goal.current_progress, goal.target_reduction);
          const days = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86_400_000));
          return (
            <Card key={goal.id}>
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-md bg-emerald/10 text-emerald">
                  <Target />
                </span>
                <button
                  disabled={deletingId === goal.id}
                  onClick={() => removeGoal(goal.id)}
                  className="text-ink/35 hover:text-red-600 disabled:opacity-50"
                  aria-label={`Delete ${goal.title}`}
                >
                  {deletingId === goal.id ? <Spinner /> : <Trash2 size={17} />}
                </button>
              </div>
              <h2 className="mt-5 text-lg font-extrabold">{goal.title}</h2>
              <div className="mt-6 flex items-end justify-between">
                <span className="text-sm text-ink/55">
                  {goal.current_progress.toFixed(1)} of {goal.target_reduction} kg
                </span>
                <strong className="text-xl">{progress}%</strong>
              </div>
              <div className="mt-2">
                <Progress value={progress} label={`${goal.title} progress`} />
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-xs text-ink/50">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {days} days remaining
                </span>
                <span className="capitalize">{goal.category || "All categories"}</span>
              </div>
            </Card>
          );
        })}
      </section>

      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/45 p-4">
          <form onSubmit={submit} className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Create a goal</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="title">Goal title</label>
                <input id="title" name="title" required placeholder="Save 5 kg this month" />
              </div>
              <div>
                <label htmlFor="target_reduction">Target reduction (kg)</label>
                <input
                  id="target_reduction"
                  name="target_reduction"
                  type="number"
                  min=".1"
                  step=".1"
                  required
                />
              </div>
              <div>
                <label htmlFor="deadline">Deadline</label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  min={new Date(Date.now() + 86_400_000).toISOString().slice(0, 10)}
                  required
                />
              </div>
              <div>
                <label htmlFor="category">Category</label>
                <select id="category" name="category">
                  <option value="">All categories</option>
                  {["transport", "electricity", "food", "shopping", "waste"].map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}
              <Button className="w-full" disabled={submitting}>
                {submitting && <Spinner />}
                {submitting ? "Creating goal" : "Create goal"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
