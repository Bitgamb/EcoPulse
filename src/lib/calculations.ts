import type { CarbonEntry, Category } from "@/types/carbon";

const roundToHundredths = (value: number) => Math.round(value * 100) / 100;

const sumEmissions = (entries: CarbonEntry[]) =>
  roundToHundredths(entries.reduce((total, entry) => total + Number(entry.co2_amount), 0));

const startOfPeriod = (days: number, now = new Date()) => {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - days + 1);
  return start;
};

const entriesSince = (entries: CarbonEntry[], days: number, now?: Date) => {
  const start = startOfPeriod(days, now);
  return entries.filter((entry) => new Date(entry.entry_date) >= start);
};

export const calculateWeeklyTotal = (entries: CarbonEntry[], now?: Date) =>
  sumEmissions(entriesSince(entries, 7, now));

export const calculateMonthlyTotal = (entries: CarbonEntry[], now?: Date) =>
  sumEmissions(entriesSince(entries, 30, now));

export const calculateCO2Saved = (entries: CarbonEntry[], actionSavings = 0) => {
  const avoidedEmissions = Math.abs(sumEmissions(entries.filter((entry) => entry.co2_amount < 0)));
  return Math.max(0, roundToHundredths(actionSavings + avoidedEmissions));
};

export function getBiggestEmissionCategory(entries: CarbonEntry[]): Category | null {
  const totals = new Map<Category, number>();
  for (const entry of entries) {
    totals.set(entry.category, (totals.get(entry.category) ?? 0) + Math.max(0, entry.co2_amount));
  }
  return [...totals].sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;
}

export const calculateEcoScore = (monthly: number, completed = 0, streak = 0) =>
  Math.max(0, Math.min(100, Math.round(100 - monthly * 0.45 + completed * 2 + Math.min(streak, 10))));

export const calculateGoalProgress = (current: number, target: number) =>
  target <= 0 ? 0 : Math.min(100, Math.max(0, Math.round((current / target) * 100)));
