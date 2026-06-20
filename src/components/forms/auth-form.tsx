"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authSchema } from "@/lib/validations";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    const parsed = authSchema.safeParse({
      name: form.get("name") || undefined,
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      setError("Authentication is unavailable because Supabase is not configured.");
      return;
    }

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({
            email: parsed.data.email,
            password: parsed.data.password,
          })
        : await supabase.auth.signUp({
            email: parsed.data.email,
            password: parsed.data.password,
            options: { data: { full_name: parsed.data.name } },
          });
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    if (mode === "register" && !result.data.session) {
      setSuccess("Account created. Check your email to confirm your address, then log in.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "register" && (
        <div>
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" autoComplete="name" required placeholder="Your name" />
        </div>
      )}
      <div>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </div>
      <div>
        <div className="flex justify-between">
          <label htmlFor="password">Password</label>
          {mode === "login" && <span className="text-xs text-ink/45">Minimum 8 characters</span>}
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={8}
          placeholder="At least 8 characters"
        />
      </div>
      {error && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p
          role="status"
          className="flex gap-2 rounded-md border border-emerald/20 bg-emerald/10 p-3 text-sm text-emerald"
        >
          <CheckCircle2 className="mt-0.5 shrink-0" size={17} />
          {success}
        </p>
      )}
      <Button className="w-full" disabled={loading}>
        {loading && <Spinner />}
        {mode === "login" ? "Log in" : "Create account"}
      </Button>
      <p className="text-center text-sm text-ink/60">
        {mode === "login" ? "New to EcoPulse? " : "Already have an account? "}
        <Link className="font-bold text-emerald" href={mode === "login" ? "/register" : "/login"}>
          {mode === "login" ? "Create an account" : "Log in"}
        </Link>
      </p>
    </form>
  );
}
