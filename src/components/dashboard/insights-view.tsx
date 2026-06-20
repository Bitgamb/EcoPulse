"use client";
import { ArrowDown, Bus, Lightbulb, Sparkles } from "lucide-react";
import { useEcoData } from "./data-provider";
import { generateInsights } from "@/lib/insights";
import { Card } from "@/components/ui/card";
import { pretty } from "@/lib/utils";
export function InsightsView() {
  const { entries } = useEcoData(),
    insights = generateInsights(entries);
  const main = insights[0];
  return (
    <>
      <header>
        <p className="text-sm font-bold text-emerald">PERSONALIZED FOR YOU</p>
        <h1 className="mt-1 font-display text-4xl">Your carbon insights</h1>
        <p className="mt-1 text-sm text-ink/55">Focused recommendations from your recent activity.</p>
      </header>
      {main && (
        <section className="mt-8 grid overflow-hidden rounded-lg bg-ink text-white lg:grid-cols-[1.3fr_.7fr]">
          <div className="p-7 sm:p-9">
            <div className="flex items-center gap-2 text-lime">
              <Sparkles size={17} />
              <span className="text-xs font-extrabold uppercase">Highest priority</span>
            </div>
            <h2 className="mt-7 max-w-xl font-display text-4xl">{main.title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
              {main.description} This is the clearest place to focus your next change.
            </p>
            <div className="mt-7 rounded-md border border-white/15 bg-white/5 p-4">
              <p className="text-xs font-bold text-lime">TRY THIS NEXT</p>
              <p className="mt-1 font-bold">{main.action}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-1">
            <div className="bg-white/5 p-6">
              <p className="text-xs text-white/50">Estimated saving</p>
              <strong className="mt-2 block text-3xl text-lime">{main.saving} kg</strong>
            </div>
            <div className="bg-white/5 p-6">
              <p className="text-xs text-white/50">Impact score</p>
              <strong className="mt-2 block text-3xl">
                {main.impact}
                <small className="text-base text-white/40"> / 10</small>
              </strong>
            </div>
          </div>
        </section>
      )}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Category recommendations</h2>
        <span className="text-xs text-ink/45">Based on the last 30 days</span>
      </div>
      <section className="mt-4 grid gap-4 md:grid-cols-2">
        {insights.map((i, index) => (
          <Card key={i.category}>
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-md bg-paper text-emerald">
                {index === 0 ? <Bus /> : <Lightbulb />}
              </span>
              <span
                className={`rounded-md px-2 py-1 text-xs font-bold ${i.priority === "High" ? "bg-coral/15 text-red-700" : "bg-yellow-50 text-yellow-700"}`}
              >
                {i.priority} priority
              </span>
            </div>
            <h3 className="mt-5 font-extrabold">{pretty(i.category)}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/60">{i.action}</p>
            <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-sm">
              <span className="flex items-center gap-1 text-emerald">
                <ArrowDown size={15} />
                {i.saving} kg possible
              </span>
              <strong>{i.impact}/10 impact</strong>
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}
