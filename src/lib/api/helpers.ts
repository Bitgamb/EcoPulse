import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import type { z } from "zod";
import { createClient } from "@/lib/supabase/server";

type DatabaseClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;

type ApiAuthResult = { ok: true; db: DatabaseClient; user: User } | { ok: false; response: NextResponse };

type ParseResult<T> = { ok: true; data: T } | { ok: false; response: NextResponse };

export const apiError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

export async function requireApiUser(): Promise<ApiAuthResult> {
  const db = await createClient();
  if (!db) return { ok: false, response: apiError("Database not configured", 503) };

  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user) return { ok: false, response: apiError("Unauthorized", 401) };
  return { ok: true, db, user };
}

export async function parseJson<T>(request: Request, schema: z.ZodType<T>): Promise<ParseResult<T>> {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return { ok: false, response: apiError(parsed.error.issues[0]?.message ?? "Invalid request", 400) };
    }
    return { ok: true, data: parsed.data };
  } catch {
    return { ok: false, response: apiError("Request body must be valid JSON", 400) };
  }
}
