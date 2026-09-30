import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { matterId?: string; title?: string; summary?: string; rationale?: string; status?: string; openItemId?: string; actions?: { action: string; owner?: string }[] } | null;
  if (!body?.matterId || !body.title || !body.summary) return NextResponse.json({ error: "matterId, title, and summary are required." }, { status: 400 });
  const client = createSupabaseServerClient();
  const decisionId = `DECISION-${createHash("sha1").update(`${body.matterId}:${body.title}:${Date.now()}`).digest("hex").slice(0, 12)}`;
  const followUpActions = (body.actions ?? []).filter((item) => item.action.trim()).map((item, index) => ({ action_id: `${decisionId}-ACTION-${index + 1}`, action: item.action.trim(), owner: item.owner?.trim() || null, status: "OPEN" }));
  const { error } = await client.from("decision").insert({ decision_id: decisionId, matter_id: body.matterId, decision_type: "INTERNAL_STRATEGY", decision_title: body.title, decision_summary: body.summary, decision_rationale: body.rationale ?? null, decision_status: body.status ?? "PROPOSED", decision_date: new Date().toISOString().slice(0, 10), follow_up_actions: followUpActions, selected_actions: followUpActions.map((item) => item.action_id) });
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });
  if (body.openItemId) {
    const { error: relationError } = await client.from("decision_issue").insert({ decision_id: decisionId, issue_id: body.openItemId, relationship: "resolves" });
    if (relationError) return NextResponse.json({ error: relationError.message }, { status: 502 });
  }
  await client.from("audit_event").insert({ audit_event_id: `AUDIT-${decisionId}`, matter_id: body.matterId, event_type: "DECISION_RECORDED", entity_type: "decision", entity_id: decisionId, payload: { actionCount: followUpActions.length, openItemId: body.openItemId ?? null } });
  return NextResponse.json({ decisionId, actionCount: followUpActions.length }, { status: 201 });
}
