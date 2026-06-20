import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, parseJson, requireApiUser } from "@/lib/api/helpers";
import { goalSchema } from "@/lib/validations";

const goalIdSchema = z.string().uuid("Invalid goal");
const GOAL_COLUMNS = "id,title,category,target_reduction,current_progress,deadline,status";

export async function GET() {
  const auth = await requireApiUser();
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.db
    .from("goals")
    .select(GOAL_COLUMNS)
    .order("deadline", { ascending: true });

  if (error) return apiError("Unable to load goals", 500);
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if (!auth.ok) return auth.response;
  const body = await parseJson(request, goalSchema);
  if (!body.ok) return body.response;

  const { data, error } = await auth.db
    .from("goals")
    .insert({ ...body.data, user_id: auth.user.id })
    .select(GOAL_COLUMNS)
    .single();

  if (error) return apiError("Unable to create goal", 500);
  return NextResponse.json({ data }, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await requireApiUser();
  if (!auth.ok) return auth.response;
  const parsedId = goalIdSchema.safeParse(new URL(request.url).searchParams.get("id"));
  if (!parsedId.success) return apiError(parsedId.error.issues[0]?.message ?? "Invalid goal", 400);

  const { error } = await auth.db.from("goals").delete().eq("id", parsedId.data);
  if (error) return apiError("Unable to delete goal", 500);
  return NextResponse.json({ data: true });
}
