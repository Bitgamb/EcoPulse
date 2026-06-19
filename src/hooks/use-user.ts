"use client";
import { useEffect, useState } from "react";
import { getLocalAccount } from "@/lib/local-auth";
import { createClient } from "@/lib/supabase/client";

export type UserIdentity = { name: string; email: string; initials: string; mode: "demo" | "local" | "supabase" };

const initialsFor = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "EP";

export function useUser() {
  const [user, setUser] = useState<UserIdentity>({ name: "EcoPulse user", email: "", initials: "EP", mode: "local" });

  useEffect(() => {
    if (document.cookie.includes("ecopulse-demo=true")) {
      setUser({ name: "Aarav Sharma", email: "demo@ecopulse.app", initials: "AS", mode: "demo" });
      return;
    }
    const local = getLocalAccount();
    if (local && document.cookie.includes("ecopulse-local=true")) {
      setUser({ name: local.name, email: local.email, initials: initialsFor(local.name), mode: "local" });
      return;
    }
    createClient()?.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      const name = String(data.user.user_metadata.full_name || data.user.email?.split("@")[0] || "EcoPulse user");
      setUser({ name, email: data.user.email || "", initials: initialsFor(name), mode: "supabase" });
    });
  }, []);

  return user;
}
