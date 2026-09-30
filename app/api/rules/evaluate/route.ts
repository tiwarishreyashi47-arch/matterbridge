import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMatter } from "@/lib/data/matter-service";
import { evaluateMatterRules } from "@/lib/rules";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { matterId?: string } | null;
  if (!body?.matterId) return NextResponse.json({ error: "matterId is required." }, { status: 400 });
  const matter = await getMatter(body.matterId);
  if (!matter) return NextResponse.json({ error: "Matter not found." }, { status: 404 });
  const issues = evaluateMatterRules(matter);
  const { error } = await createSupabaseServerClient().from("issue").upsert(issues, { onConflict: "issue_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });
  return NextResponse.json({ issues, changeSummary: `${issues.length} rule-generated issue(s) evaluated.` });
}
