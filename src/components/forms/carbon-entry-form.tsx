"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, CheckCircle2 } from "lucide-react";
import { useEcoData } from "@/components/dashboard/data-provider";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { activities, calculateCO2, getActivityMeta } from "@/lib/emission-factors";
import { pretty } from "@/lib/utils";
import { entrySchema } from "@/lib/validations";
import type { Category } from "@/types/carbon";

export function CarbonEntryForm() {
  const [category, setCategory] = useState<Category>("transport");
  const [activityType, setActivityType] = useState("car_km");
  const [value, setValue] = useState(10);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addEntry } = useEcoData();
  const router = useRouter();
  const meta = getActivityMeta(activityType);
  const estimate = useMemo(() => calculateCO2(activityType, value || 0), [activityType, value]);

  function changeCategory(nextCategory: Category) {
    setCategory(nextCategory);
    setActivityType(Object.keys(activities[nextCategory])[0]);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const parsed = entrySchema.safeParse({
      category,
      activity_type: activityType,
      value,
      unit: String(meta?.[2] || "unit"),
      entry_date: form.get("entry_date"),
      note: form.get("note"),
    });

    if (!parsed.success) {
      setSubmitting(false);
      setError(parsed.error.issues[0]?.message ?? "Check the activity details.");
      return;
    }

    const saved = await addEntry({
      id: crypto.randomUUID(),
      ...parsed.data,
      co2_amount: estimate,
    });
    setSubmitting(false);
    if (!saved) {
      setError("The activity was not saved. Review the error above and try again.");
      return;
    }

    setMessage("Activity saved. Your dashboard is up to date.");
    router.push("/dashboard");
  }

  return (
    <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(event) => changeCategory(event.target.value as Category)}
            >
              {Object.keys(activities).map((item) => (
                <option key={item} value={item}>
                  {pretty(item)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="activity">Activity type</label>
            <select
              id="activity"
              value={activityType}
              onChange={(event) => setActivityType(event.target.value)}
            >
              {Object.entries(activities[category]).map(([key, item]) => (
                <option key={key} value={key}>
                  {item[0]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="value">Amount</label>
            <div className="relative">
              <input
                id="value"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={value}
                onChange={(event) => setValue(Number(event.target.value))}
              />
              <span className="absolute right-3 top-3 text-sm text-ink/45">{meta?.[2]}</span>
            </div>
          </div>
          <div>
            <label htmlFor="entry_date">Date</label>
            <input
              id="entry_date"
              name="entry_date"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="note">
              Note <span className="font-normal text-ink/40">(optional)</span>
            </label>
            <textarea
              id="note"
              name="note"
              rows={4}
              maxLength={300}
              placeholder="Anything useful to remember about this activity"
            />
          </div>
        </div>
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {message && (
          <p
            role="status"
            className="mt-5 flex items-center gap-2 rounded-md bg-emerald/10 p-3 text-sm font-bold text-emerald"
          >
            <CheckCircle2 size={18} />
            {message}
          </p>
        )}
        <Button className="mt-6 w-full sm:w-auto" type="submit" disabled={submitting}>
          {submitting && <Spinner />}
          {submitting ? "Saving activity" : "Add to my footprint"}
        </Button>
      </div>

      <aside className="space-y-4">
        <div className="rounded-lg bg-ink p-6 text-white">
          <div className="flex items-center gap-2 text-lime">
            <Calculator size={18} />
            <span className="text-xs font-extrabold uppercase">Live estimate</span>
          </div>
          <p className={`mt-8 font-display text-5xl ${estimate < 0 ? "text-lime" : ""}`}>
            {estimate.toFixed(2)}
          </p>
          <p className="text-sm text-white/55">kg CO₂e</p>
          <div className="mt-8 border-t border-white/15 pt-4 text-sm text-white/65">
            <div className="flex justify-between">
              <span>Factor</span>
              <span>
                {meta?.[1]} kg / {String(meta?.[2]).replace(/s$/, "")}
              </span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Impact level</span>
              <span className="font-bold text-lime">
                {estimate < 1 ? "Low" : estimate < 5 ? "Moderate" : "High"}
              </span>
            </div>
          </div>
          {estimate < 0 && (
            <p className="mt-4 text-xs text-lime">
              This activity represents avoided emissions and counts toward CO₂ saved.
            </p>
          )}
        </div>
        <div className="rounded-lg border border-ink/10 bg-white p-5">
          <p className="text-sm font-bold">How estimates work</p>
          <p className="mt-2 text-xs leading-5 text-ink/55">
            We multiply your activity by a documented average emission factor. Results help compare habits and
            are not an audited carbon inventory.
          </p>
        </div>
      </aside>
    </form>
  );
}
