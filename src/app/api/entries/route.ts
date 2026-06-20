import { NextResponse } from "next/server";
import { requireApiUser, apiError, parseJson } from "@/lib/api/helpers";
import { calculateCO2 } from "@/lib/emission-factors";
import { entrySchema } from "@/lib/validations";

const ENTRY_COLUMNS = "id,category,activity_type,value,unit,co2_amount,entry_date,note";

export async function GET() {
  const auth = await requireApiUser();
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.db
    .from("carbon_entries")
    .select(ENTRY_COLUMNS)
    .order("entry_date", { ascending: false })
    .limit(100);

  if (error) return apiError("Unable to load entries", 500);
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if (!auth.ok) return auth.response;
  const body = await parseJson(request, entrySchema);
  if (!body.ok) return body.response;

  const row = {
    ...body.data,
    user_id: auth.user.id,
    co2_amount: calculateCO2(body.data.activity_type, body.data.value),
  };
  const { data, error } = await auth.db.from("carbon_entries").insert(row).select(ENTRY_COLUMNS).single();

  if (error) return apiError("Unable to save entry", 500);
  return NextResponse.json({ data }, { status: 201 });
}
