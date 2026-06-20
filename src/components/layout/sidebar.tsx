"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  BarChart3,
  Lightbulb,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  Target,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import { useEcoData } from "@/components/dashboard/data-provider";
import { calculateMonthlyTotal } from "@/lib/calculations";
import { endLocalSession } from "@/lib/local-auth";
const nav = [
  ["/dashboard", BarChart3, "Overview"],
  ["/dashboard/add-entry", PlusCircle, "Add entry"],
  ["/dashboard/insights", Lightbulb, "Insights"],
  ["/dashboard/actions", Zap, "Eco actions"],
  ["/dashboard/goals", Target, "Goals"],
  ["/dashboard/badges", Award, "Badges"],
  ["/dashboard/settings", Settings, "Settings"],
] as const;
export function Sidebar() {
  const path = usePathname(),
    router = useRouter(),
    [open, setOpen] = useState(false),
    user = useUser(),
    { entries } = useEcoData(),
    monthly = calculateMonthlyTotal(entries);
  async function logout() {
    document.cookie = "ecopulse-demo=; path=/; max-age=0";
    endLocalSession();
    await createClient()?.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 grid size-10 place-items-center rounded-md bg-ink text-white shadow-lg lg:hidden"
        aria-label="Open navigation"
      >
        <Menu />
      </button>
      {open && (
        <button
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-y-auto border-r border-ink/10 bg-white p-4 transition-transform lg:translate-x-0 lg:p-5",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button onClick={() => setOpen(false)} className="lg:hidden" aria-label="Close navigation">
            <X />
          </button>
        </div>
        <div className="mt-6 rounded-md bg-ink p-3.5 text-white lg:mt-9 lg:p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase text-white/50">This month</p>
            <span className="size-2 rounded-full bg-lime" />
          </div>
          <strong className="mt-1.5 block text-xl lg:mt-2 lg:text-2xl">{monthly.toFixed(1)} kg</strong>
          <p className="mt-1 text-[11px] text-white/50">
            CO2‚e from {entries.length} {entries.length === 1 ? "activity" : "activities"}
          </p>
        </div>
        <nav className="mt-4 flex-1 space-y-0.5 lg:mt-7 lg:space-y-1" aria-label="Dashboard navigation">
          {nav.map(([href, Icon, label]) => {
            const active = href === "/dashboard" ? path === href : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-ink/60 hover:bg-paper hover:text-ink lg:py-2.5",
                  active && "bg-lime text-ink hover:bg-lime hover:text-ink",
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-3 border-t border-ink/10 pt-3 lg:pt-4">
          <div className="mb-2 flex min-w-0 items-center gap-3 lg:mb-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-coral font-extrabold text-white">
              {user.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user.name}</p>
              <p className="truncate text-xs text-ink/50">
                {user.mode === "demo" ? "Demo workspace" : user.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-ink/60 hover:bg-paper"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
