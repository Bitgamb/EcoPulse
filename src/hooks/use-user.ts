"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type UserIdentity = {
  name: string;
  email: string;
  initials: string;
  mode: "demo" | "supabase";
};

const initialsFor = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "EP";

export function useUser() {
  const [user, setUser] = useState<UserIdentity>({
    name: "EcoPulse user",
    email: "",
    initials: "EP",
    mode: "supabase",
  });

  useEffect(() => {
    if (document.cookie.includes("ecopulse-demo=true")) {
      setUser({ name: "Aarav Sharma", email: "demo@ecopulse.app", initials: "AS", mode: "demo" });
      return;
    }
    createClient()
      ?.auth.getUser()
      .then(({ data }) => {
        if (!data.user) return;
        const name = String(
          data.user.user_metadata.full_name || data.user.email?.split("@")[0] || "EcoPulse user",
        );
        setUser({ name, email: data.user.email || "", initials: initialsFor(name), mode: "supabase" });
      });
  }, []);

  return user;
}
