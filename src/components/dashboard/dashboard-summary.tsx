import { Flame, Leaf, Sparkles, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { calculateCO2Saved, calculateMonthlyTotal, calculateWeeklyTotal } from "@/lib/calculations";
import type { CarbonEntry, EcoAction } from "@/types/carbon";

type DashboardSummaryProps = {
  entries: CarbonEntry[];
  actions: EcoAction[];
  streak: number;
};

export function DashboardSummary({ entries, actions, streak }: DashboardSummaryProps) {
  const completedSavings = actions
    .filter((action) => action.completed)
    .reduce((total, action) => total + action.estimated_saving, 0);
  const saved = calculateCO2Saved(entries, completedSavings);
  const metrics = [
    {
      label: "This week",
      value: `${calculateWeeklyTotal(entries).toFixed(1)} kg`,
      detail: "CO2e recorded",
      icon: Leaf,
    },
    {
      label: "This month",
      value: `${calculateMonthlyTotal(entries).toFixed(1)} kg`,
      detail: entries.length
        ? `${entries.length} logged ${entries.length === 1 ? "activity" : "activities"}`
        : "No activity yet",
      icon: TrendingDown,
    },
    { label: "CO2 saved", value: `${saved.toFixed(1)} kg`, detail: "from completed actions", icon: Sparkles },
    {
      label: "Green streak",
      value: `${streak} ${streak === 1 ? "day" : "days"}`,
      detail: streak ? "Keep it going" : "Log today to begin",
      icon: Flame,
    },
  ];

  return (
    <section className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Footprint summary">
      {metrics.map(({ label, value, detail, icon: Icon }) => (
        <Card key={label} className="min-w-0 p-4 transition hover:-translate-y-0.5 hover:shadow-soft sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[10px] font-extrabold uppercase text-ink/45 sm:text-xs">{label}</p>
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-paper text-emerald sm:size-8">
              <Icon size={16} aria-hidden="true" />
            </span>
          </div>
          <strong className="mt-4 block text-xl sm:mt-5 sm:text-2xl">{value}</strong>
          <span className="block truncate text-[10px] text-ink/50 sm:text-xs">{detail}</span>
        </Card>
      ))}
    </section>
  );
}
