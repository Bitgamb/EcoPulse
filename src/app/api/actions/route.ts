import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, parseJson, requireApiUser } from "@/lib/api/helpers";

const actionIdSchema = z.object({ id: z.string().uuid("Invalid action") });
const ACTION_COLUMNS = "id,title,description,category,estimated_saving,difficulty,completed";

export async function GET() {
  const auth = await requireApiUser();
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.db
    .from("eco_actions")
    .select(ACTION_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) return apiError("Unable to load actions", 500);
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const auth = await requireApiUser();
  if (!auth.ok) return auth.response;
  const body = await parseJson(request, actionIdSchema);
  if (!body.ok) return body.response;

  const { data, error } = await auth.db.rpc("complete_eco_action", {
    p_action_id: body.data.id,
  });

  if (error || !data) return apiError("Unable to complete action", 500);
  return NextResponse.json({ data });
}
