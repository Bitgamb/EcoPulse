"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Plus, Sparkles } from "lucide-react";
import { useEcoData } from "./data-provider";
import { calculateEcoScore, calculateMonthlyTotal, getBiggestEmissionCategory } from "@/lib/calculations";
import { generateInsights } from "@/lib/insights";
import { Card } from "@/components/ui/card";
import { pretty } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/hooks/use-user";
import { EmptyState } from "@/components/ui/empty-state";
import { DashboardSummary } from "./dashboard-summary";
import { RecentActivity } from "./recent-activity";
const ChartSkeleton = () => (
  <div className="h-64 animate-pulse rounded-md bg-ink/5" role="status" aria-label="Loading chart" />
);
const WeeklyTrend = dynamic(
  () => import("@/components/charts/weekly-trend").then((module) => module.WeeklyTrend),
  { ssr: false, loading: ChartSkeleton },
);
const CategoryPie = dynamic(
  () => import("@/components/charts/category-pie").then((module) => module.CategoryPie),
  { ssr: false, loading: ChartSkeleton },
);
export function DashboardView() {
  const { entries, actions, goals, streak } = useEcoData();
  const user = useUser();
  const completed = actions.filter((action) => action.completed);
  const month = calculateMonthlyTotal(entries);
  const score = calculateEcoScore(month, completed.length, streak);
  const insight = generateInsights(entries)[0];
  const biggest = getBiggestEmissionCategory(entries);
  const firstName = user.name.split(" ")[0];
  const now = new Date();
  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);
  const greeting = now.getHours() < 12 ? "morning" : now.getHours() < 18 ? "afternoon" : "evening";
  const goal = goals[0];
  const goalPct = goal ? Math.min(100, Math.round((goal.current_progress / goal.target_reduction) * 100)) : 0;
  return (
    <>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-emerald">{today}</p>
          <h1 className="mt-1 font-display text-4xl">
            Good {greeting}, {firstName}.
          </h1>
          <p className="mt-1 text-sm text-ink/55">
            {entries.length
              ? "Here's how your choices are adding up."
              : "Let's establish your baseline and find your first easy win."}
          </p>
        </div>
        <Link
          href="/dashboard/add-entry"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 text-sm font-bold text-white shadow-sm hover:bg-emerald"
        >
          <Plus size={17} aria-hidden="true" />
          Add activity
        </Link>
      </header>
      <DashboardSummary entries={entries} actions={actions} streak={streak} />
      {!entries.length ? (
        <section className="mt-4 overflow-hidden rounded-lg bg-ink text-white">
          <div className="grid lg:grid-cols-[1.1fr_.9fr]">
            <div className="p-7 sm:p-10">
              <span className="text-xs font-extrabold uppercase text-lime">Your first five minutes</span>
              <h2 className="mt-4 max-w-lg font-display text-4xl">
                Build a footprint you can actually improve.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/60">
                Log one recent journey, meal, or energy use. EcoPulse will calculate the impact and turn it
                into a useful starting point.
              </p>
              <Link
                href="/dashboard/add-entry"
                className="mt-7 inline-flex h-11 items-center gap-2 rounded-md bg-lime px-5 text-sm font-extrabold text-ink"
              >
                Log my first activity <ArrowRight size={17} />
              </Link>
            </div>
            <div className="grid gap-px bg-white/10 sm:grid-cols-3 lg:grid-cols-1">
              <div className="flex items-center gap-4 bg-white/5 p-5">
                <span className="grid size-9 place-items-center rounded-full bg-white/10 font-bold text-lime">
                  1
                </span>
                <div>
                  <strong className="text-sm">Add one activity</strong>
                  <p className="text-xs text-white/45">Choose from 27 everyday actions</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-5">
                <span className="grid size-9 place-items-center rounded-full bg-white/10 font-bold text-lime">
                  2
                </span>
                <div>
                  <strong className="text-sm">See your estimate</strong>
                  <p className="text-xs text-white/45">Understand the impact instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-5">
                <span className="grid size-9 place-items-center rounded-full bg-white/10 font-bold text-lime">
                  3
                </span>
                <div>
                  <strong className="text-sm">Take a simple action</strong>
                  <p className="text-xs text-white/45">Start saving CO2e this week</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_.85fr]">
            <Card>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-extrabold">Weekly footprint</h2>
                  <p className="text-xs text-ink/50">Daily CO2e in kilograms</p>
                </div>
                <span className="rounded-md bg-emerald/10 px-2 py-1 text-xs font-bold text-emerald">
                  Last 7 days
                </span>
              </div>
              <WeeklyTrend entries={entries} />
            </Card>
            <Card>
              <h2 className="font-extrabold">By category</h2>
              <p className="text-xs text-ink/50">
                Your biggest source is {biggest ? pretty(biggest) : "not available"}
              </p>
              <CategoryPie entries={entries} />
            </Card>
          </section>
          <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.35fr]">
            <Card className="bg-ink text-white">
              <div className="flex items-center gap-2 text-lime">
                <Sparkles size={17} />
                <span className="text-xs font-extrabold uppercase">Priority insight</span>
              </div>
              <h2 className="mt-5 font-display text-2xl">{insight?.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">{insight?.action}</p>
              {insight && (
                <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
                  <span className="text-xs">Potential saving</span>
                  <strong className="text-lime">{insight.saving.toFixed(1)} kg</strong>
                </div>
              )}
              <Link
                href="/dashboard/insights"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white"
              >
                See all insights <ArrowRight size={16} />
              </Link>
            </Card>
            <Card>
              {goal ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-extrabold">Active goal</h2>
                      <p className="text-xs text-ink/50">{goal.title}</p>
                    </div>
                    <strong className="text-2xl">{goalPct}%</strong>
                  </div>
                  <div className="mt-5">
                    <Progress value={goalPct} />
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-ink/55">
                    <span>{goal.current_progress.toFixed(1)} kg saved</span>
                    <span>{goal.target_reduction} kg target</span>
                  </div>
                </>
              ) : (
                <EmptyState
                  title="Set your first reduction goal"
                  body="Turn your next improvement into a measurable target."
                />
              )}
              <div className="mt-6 flex justify-between border-t border-ink/10 pt-4">
                <span className="text-sm">Eco score</span>
                <span className="font-display text-3xl text-emerald">
                  {score}
                  <small className="text-sm text-ink/40">/100</small>
                </span>
              </div>
            </Card>
          </section>
        </>
      )}
      <RecentActivity entries={entries} />
    </>
  );
}
