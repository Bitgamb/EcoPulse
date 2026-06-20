"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Flame, Leaf, Plus, Sparkles, TrendingDown } from "lucide-react";
import { useEcoData } from "./data-provider";
import {
  calculateCO2Saved,
  calculateEcoScore,
  calculateMonthlyTotal,
  calculateWeeklyTotal,
  getBiggestEmissionCategory,
} from "@/lib/calculations";
import { generateInsights } from "@/lib/insights";
import { Card } from "@/components/ui/card";
import { pretty } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/hooks/use-user";
import { EmptyState } from "@/components/ui/empty-state";
const ChartSkeleton = () => (
  <div className="h-64 animate-pulse rounded-md bg-ink/5" aria-label="Loading chart" />
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
  const { entries, actions, goals, streak } = useEcoData(),
    user = useUser();
  const completed = actions.filter((a) => a.completed),
    saved = calculateCO2Saved(
      entries,
      completed.reduce((s, a) => s + a.estimated_saving, 0),
    ),
    month = calculateMonthlyTotal(entries),
    score = calculateEcoScore(month, completed.length, streak),
    insight = generateInsights(entries)[0],
    biggest = getBiggestEmissionCategory(entries),
    firstName = user.name.split(" ")[0],
    today = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(
      new Date(),
    ),
    goal = goals[0],
    goalPct = goal ? Math.min(100, Math.round((goal.current_progress / goal.target_reduction) * 100)) : 0;
  return (
    <>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-emerald">{today}</p>
          <h1 className="mt-1 font-display text-4xl">
            Good{" "}
            {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},{" "}
            {firstName}.
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
          <Plus size={17} />
          Add activity
        </Link>
      </header>
      <section className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          ["This week", calculateWeeklyTotal(entries).toFixed(1) + " kg", "CO2‚e recorded", Leaf],
          [
            "This month",
            month.toFixed(1) + " kg",
            entries.length
              ? `${entries.length} logged ${entries.length === 1 ? "activity" : "activities"}`
              : "No activity yet",
            TrendingDown,
          ],
          ["CO2‚ saved", saved.toFixed(1) + " kg", "from completed actions", Sparkles],
          [
            "Green streak",
            streak + ` ${streak === 1 ? "day" : "days"}`,
            streak ? "Keep it going" : "Log today to begin",
            Flame,
          ],
        ].map(([label, value, sub, Icon]) => (
          <Card
            key={String(label)}
            className="min-w-0 p-4 transition hover:-translate-y-0.5 hover:shadow-soft sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-extrabold uppercase text-ink/45 sm:text-xs">{label as string}</p>
              <span className="grid size-7 shrink-0 place-items-center rounded-md bg-paper text-emerald sm:size-8">
                <Icon size={16} />
              </span>
            </div>
            <strong className="mt-4 block text-xl sm:mt-5 sm:text-2xl">{value as string}</strong>
            <span className="block truncate text-[10px] text-ink/50 sm:text-xs">{sub as string}</span>
          </Card>
        ))}
      </section>
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
                  <p className="text-xs text-white/45">Start saving CO2‚e this week</p>
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
                  <p className="text-xs text-ink/50">Daily CO2‚e in kilograms</p>
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
      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold">Recent activity</h2>
            <p className="text-xs text-ink/50">Your latest logged choices</p>
          </div>
          <Link href="/dashboard/add-entry" className="text-sm font-bold text-emerald">
            Add new
          </Link>
        </div>
        {entries.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="border-b border-ink/10 text-xs uppercase text-ink/45">
                <tr>
                  <th className="py-3">Activity</th>
                  <th>Category</th>
                  <th>Value</th>
                  <th>Date</th>
                  <th className="text-right">CO2‚e</th>
                </tr>
              </thead>
              <tbody>
                {entries.slice(0, 5).map((e) => (
                  <tr key={e.id} className="border-b border-ink/5">
                    <td className="py-3 font-bold">{pretty(e.activity_type)}</td>
                    <td className="capitalize text-ink/60">{e.category}</td>
                    <td>
                      {e.value} {e.unit}
                    </td>
                    <td className="text-ink/60">
                      {new Date(e.entry_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className={`text-right font-bold ${e.co2_amount < 0 ? "text-emerald" : ""}`}>
                      {e.co2_amount.toFixed(2)} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Your activity feed starts here"
            body="Add a journey, meal, purchase, energy use, or waste activity to begin."
          />
        )}
      </Card>
    </>
  );
}
