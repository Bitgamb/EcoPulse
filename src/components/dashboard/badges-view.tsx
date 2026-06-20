"use client";
import { Award, Flame, Lock, Recycle, Sprout, TrainFront, Zap } from "lucide-react";
import { useEcoData } from "./data-provider";
import { badgeDefinitions, getUnlockedBadges } from "@/lib/badges";
import { calculateCO2Saved } from "@/lib/calculations";
import { Card } from "@/components/ui/card";
const icons = { Sprout, TrainFront, Zap, Recycle, Flame, Award };
export function BadgesView() {
  const { entries, actions, streak } = useEcoData(),
    saved = calculateCO2Saved(
      entries,
      actions.filter((a) => a.completed).reduce((s, a) => s + a.estimated_saving, 0),
    ),
    unlocked = getUnlockedBadges(entries, actions, streak, saved).map((b) => b.name);
  return (
    <>
      <header>
        <p className="text-sm font-bold text-emerald">YOUR MILESTONES</p>
        <h1 className="mt-1 font-display text-4xl">Badge cabinet</h1>
        <p className="mt-1 text-sm text-ink/55">Proof that steady progress adds up.</p>
      </header>
      <div className="mt-8 rounded-lg bg-ink p-6 text-white">
        <p className="text-xs font-bold text-lime">BADGE PROGRESS</p>
        <div className="mt-2 flex items-end justify-between">
          <strong className="font-display text-4xl">
            {unlocked.length} <small className="text-lg text-white/40">of {badgeDefinitions.length}</small>
          </strong>
          <span className="text-sm text-white/55">Next: Climate Hero at 25 kg saved</span>
        </div>
      </div>
      <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {badgeDefinitions.map((b) => {
          const yes = unlocked.includes(b.name),
            Icon = icons[b.icon as keyof typeof icons];
          return (
            <Card key={b.name} className={!yes ? "bg-white/50" : "border-emerald/30"}>
              <div
                className={`grid size-14 place-items-center rounded-full ${yes ? "bg-lime text-ink" : "bg-ink/5 text-ink/30"}`}
              >
                {yes ? <Icon /> : <Lock />}
              </div>
              <h2 className={`mt-5 font-extrabold ${!yes ? "text-ink/45" : ""}`}>{b.name}</h2>
              <p className="mt-2 text-sm text-ink/50">{b.description}</p>
              <span className={`mt-5 inline-block text-xs font-bold ${yes ? "text-emerald" : "text-ink/35"}`}>
                {yes ? "Unlocked" : "In progress"}
              </span>
            </Card>
          );
        })}
      </section>
    </>
  );
}
