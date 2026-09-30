import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { engagementId?: string; briefId?: string; summary?: string } | null;
  if (!body?.engagementId || !body.summary?.trim()) return NextResponse.json({ error: "engagementId and summary are required." }, { status: 400 });
  const outputId = `OUTPUT-${createHash("sha1").update(`${body.engagementId}:${Date.now()}`).digest("hex").slice(0, 12)}`;
  const client = createSupabaseServerClient();
  const { data: engagement } = await client.from("engagement").select("matter_id").eq("engagement_id", body.engagementId).maybeSingle();
  const { error } = await client.from("counsel_output").insert({ output_id: outputId, engagement_id: body.engagementId, brief_id: body.briefId ?? null, output_type: "WRITTEN_ADVICE", output_status: "RECEIVED", opinion_summary: body.summary.trim(), output_date: new Date().toISOString().slice(0, 10), opinion_sections: [], review_points: [] });
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });
  if (engagement?.matter_id) await client.from("audit_event").insert({ audit_event_id: `AUDIT-${outputId}`, matter_id: engagement.matter_id, event_type: "COUNSEL_ADVICE_RECORDED", entity_type: "counsel_output", entity_id: outputId, payload: { engagementId: body.engagementId } });
  return NextResponse.json({ outputId }, { status: 201 });
}
