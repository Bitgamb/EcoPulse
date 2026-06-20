import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { pretty } from "@/lib/utils";
import type { CarbonEntry } from "@/types/carbon";

export function RecentActivity({ entries }: { entries: CarbonEntry[] }) {
  return (
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
            <caption className="sr-only">Five most recently logged carbon activities</caption>
            <thead className="border-b border-ink/10 text-xs uppercase text-ink/45">
              <tr>
                <th scope="col" className="py-3">
                  Activity
                </th>
                <th scope="col">Category</th>
                <th scope="col">Value</th>
                <th scope="col">Date</th>
                <th scope="col" className="text-right">
                  CO2e
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(0, 5).map((entry) => (
                <tr key={entry.id} className="border-b border-ink/5">
                  <td className="py-3 font-bold">{pretty(entry.activity_type)}</td>
                  <td className="capitalize text-ink/60">{entry.category}</td>
                  <td>
                    {entry.value} {entry.unit}
                  </td>
                  <td className="text-ink/60">
                    {new Date(entry.entry_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className={`text-right font-bold ${entry.co2_amount < 0 ? "text-emerald" : ""}`}>
                    {entry.co2_amount.toFixed(2)} kg
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
  );
}
