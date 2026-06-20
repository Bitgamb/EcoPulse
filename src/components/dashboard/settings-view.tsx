"use client";
import { useState } from "react";
import { Bell, Check, RefreshCw, Shield } from "lucide-react";
import { useEcoData } from "./data-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
export function SettingsView() {
  const { reset } = useEcoData(),
    user = useUser(),
    [saved, setSaved] = useState(false);
  return (
    <>
      <header>
        <p className="text-sm font-bold text-emerald">YOUR ACCOUNT</p>
        <h1 className="mt-1 font-display text-4xl">Settings</h1>
        <p className="mt-1 text-sm text-ink/55">Manage your profile and tracking preferences.</p>
      </header>
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
        <Card>
          <h2 className="font-extrabold">Profile details</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            className="mt-5 grid gap-4 sm:grid-cols-2"
          >
            <div>
              <label htmlFor="full-name">Full name</label>
              <input id="full-name" defaultValue={user.name} />
            </div>
            <div>
              <label htmlFor="settings-email">Email</label>
              <input id="settings-email" type="email" defaultValue={user.email} />
            </div>
            <div>
              <label htmlFor="location">Location</label>
              <input id="location" placeholder="Your city" />
            </div>
            <div>
              <label htmlFor="unit-system">Measurement units</label>
              <select id="unit-system" defaultValue="metric">
                <option value="metric">Metric (kg, km)</option>
                <option value="imperial">Imperial</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Button>
                {saved ? (
                  <>
                    <Check size={16} />
                    Saved
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </Card>
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-3">
              <Bell className="text-emerald" />
              <div>
                <h2 className="font-extrabold">Weekly summary</h2>
                <p className="text-xs text-ink/50">A Friday progress email</p>
              </div>
              <input
                aria-label="Weekly summary emails"
                type="checkbox"
                defaultChecked
                className="ml-auto size-5 accent-emerald"
              />
            </div>
          </Card>
          <Card>
            <div className="flex gap-3">
              <Shield className="shrink-0 text-emerald" />
              <div>
                <h2 className="font-extrabold">Your data is private</h2>
                <p className="mt-1 text-xs leading-5 text-ink/50">
                  {user.mode === "local"
                    ? "This local account stores its data only in this browser."
                    : "Row-level security ensures account data can only be accessed by its owner."}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="font-extrabold">Workspace data</h2>
            <p className="mt-1 text-xs text-ink/50">
              {user.mode === "demo"
                ? "Restore the original demo entries, goals and actions."
                : "Clear your activities and restart your recommendations."}
            </p>
            <Button type="button" variant="secondary" className="mt-4 w-full" onClick={reset}>
              <RefreshCw size={16} />
              Reset workspace
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
