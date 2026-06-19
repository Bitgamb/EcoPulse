import { NextResponse } from "next/server";import { createClient } from "@/lib/supabase/server";
export async function GET(request:Request){const url=new URL(request.url),code=url.searchParams.get("code"),next=url.searchParams.get("next")||"/dashboard";if(code){await (await createClient())?.auth.exchangeCodeForSession(code)}return NextResponse.redirect(new URL(next,url.origin))}
