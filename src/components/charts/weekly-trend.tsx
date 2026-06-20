"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CarbonEntry } from "@/types/carbon";

export function WeeklyTrend({ entries }: { entries: CarbonEntry[] }) {
  const data = useMemo(() => {
    const totals = new Map<string, number>();
    for (const entry of entries) {
      totals.set(entry.entry_date, (totals.get(entry.entry_date) ?? 0) + Math.max(0, entry.co2_amount));
    }

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - 6 + index);
      const key = date.toISOString().slice(0, 10);
      return { day: date.toLocaleDateString("en", { weekday: "short" }), kg: totals.get(key) ?? 0 };
    });
  }, [entries]);

  return (
    <div className="h-64 w-full" aria-label="Weekly carbon emissions line chart">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dce4dc" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b8178" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b8178" }} />
          <Tooltip
            contentStyle={{ borderRadius: 6, border: "1px solid #dce4dc" }}
            formatter={(value) => [`${Number(value).toFixed(1)} kg`, "CO2e"]}
          />
          <Line
            type="monotone"
            dataKey="kg"
            stroke="#1f7a5a"
            strokeWidth={3}
            dot={{ fill: "#b8e34b", stroke: "#174c3c", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
