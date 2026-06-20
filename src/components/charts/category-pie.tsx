"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { pretty } from "@/lib/utils";
import type { CarbonEntry, Category } from "@/types/carbon";

const colors = ["#1f7a5a", "#ef795f", "#e2b93b", "#5577a8", "#8abf48"];

export function CategoryPie({ entries }: { entries: CarbonEntry[] }) {
  const data = useMemo(() => {
    const totals = entries.reduce<Partial<Record<Category, number>>>((result, entry) => {
      result[entry.category] = (result[entry.category] ?? 0) + Math.max(0, entry.co2_amount);
      return result;
    }, {});
    return Object.entries(totals).map(([name, value]) => ({ name: pretty(name), value }));
  }, [entries]);

  return (
    <div className="grid grid-cols-[1fr_120px] items-center">
      <div className="h-52">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={52} outerRadius={78} paddingAngle={3}>
              {data.map((item, index) => (
                <Cell key={item.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${Number(value).toFixed(1)} kg`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span className="size-2.5 rounded-sm" style={{ background: colors[index] }} />
            <span className="text-ink/65">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
