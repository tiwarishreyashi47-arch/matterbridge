import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function id(prefix: string, value: string) {
  return `${prefix}-${createHash("sha1").update(`${value}:${Date.now()}`).digest("hex").slice(0, 12)}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, string | undefined> | null;
  if (!body?.matterId || !body.counselName || !body.questionText || !body.issueId) {
    return NextResponse.json({ error: "matterId, counselName, issueId, and questionText are required." }, { status: 400 });
  }
  const client = createSupabaseServerClient();
  const issueId = body.issueId;
  if (issueId.startsWith("ISSUE-") || issueId.startsWith("DOC-OPEN-")) {
    const assertionId = issueId.slice("ISSUE-".length);
    const { data: assertion } = issueId.startsWith("ISSUE-") ? await client.from("assertion").select("assertion_id,matter_id,value").eq("assertion_id", assertionId).eq("matter_id", body.matterId).maybeSingle() : { data: null };
    if (issueId.startsWith("ISSUE-") && !assertion) return NextResponse.json({ error: "The extracted open-item source could not be found." }, { status: 404 });
    const title = body.issueTitle ?? (assertion ? String(assertion.value) : "Open item from uploaded document");
    const { error: issueError } = await client.from("issue").upsert({ issue_id: issueId, matter_id: body.matterId, issue_title: title, issue_description: "Extracted from an uploaded document and confirmed for counsel referral.", status: "OPEN", issue_priority: body.priority ?? "MEDIUM", requires_legal_judgment: true, created_date: new Date().toISOString().slice(0, 10) }, { onConflict: "issue_id" });
    if (issueError) return NextResponse.json({ error: issueError.message }, { status: 502 });
    if (assertion) {
      const { error: basisError } = await client.from("issue_basis").upsert({ issue_id: issueId, assertion_id: assertionId, basis_type: "extracted_open_item" }, { onConflict: "issue_id,basis_type,assertion_id,missing_item_key" });
      if (basisError) return NextResponse.json({ error: basisError.message }, { status: 502 });
    }
  }
  const counselId = id("COUNSEL", `${body.matterId}:${body.counselName}`);
  const engagementId = id("ENG", body.matterId);
  const briefId = id("BRIEF", engagementId);
  const questionId = id("QUESTION", briefId);
  const { error: counselError } = await client.from("counsel").upsert({ counsel_id: counselId, counsel_name: body.counselName, counsel_type: body.counselType ?? "EXTERNAL", firm_name: body.firmName ?? null, specialization: body.specialization ?? null, counsel_status: "ACTIVE" }, { onConflict: "counsel_id" });
  if (counselError) return NextResponse.json({ error: counselError.message }, { status: 502 });
  const { error: engagementError } = await client.from("engagement").insert({ engagement_id: engagementId, matter_id: body.matterId, counsel_id: counselId, engagement_type: body.engagementType ?? "LEGAL_ADVICE", engagement_status: "ENGAGED", engagement_description: body.engagementDescription ?? null, engagement_date: new Date().toISOString().slice(0, 10) });
  if (engagementError) return NextResponse.json({ error: engagementError.message }, { status: 502 });
  const { error: briefError } = await client.from("brief").insert({ brief_id: briefId, engagement_id: engagementId, brief_title: body.questionText.slice(0, 120), brief_status: "OPEN", brief_date: new Date().toISOString().slice(0, 10) });
  if (briefError) return NextResponse.json({ error: briefError.message }, { status: 502 });
  const { error: questionError } = await client.from("question").insert({ question_id: questionId, brief_id: briefId, issue_id: issueId, question_text: body.questionText, question_category: body.questionCategory ?? "LEGAL_ADVICE", question_priority: body.priority ?? "MEDIUM", created_date: new Date().toISOString().slice(0, 10) });
  if (questionError) return NextResponse.json({ error: questionError.message }, { status: 502 });
  if (body.adviceSummary?.trim()) {
    const outputId = id("OUTPUT", `${engagementId}:${body.adviceSummary}`);
    const summary = body.followUp?.trim() ? `${body.adviceSummary.trim()} Recommended follow-up: ${body.followUp.trim()}` : body.adviceSummary.trim();
    const { error: adviceError } = await client.from("counsel_output").insert({ output_id: outputId, engagement_id: engagementId, brief_id: briefId, output_type: "WRITTEN_ADVICE", output_status: "RECEIVED", opinion_summary: summary, output_date: new Date().toISOString().slice(0, 10), opinion_sections: [], review_points: [] });
    if (adviceError) return NextResponse.json({ error: adviceError.message }, { status: 502 });
  }
  await client.from("audit_event").insert({ audit_event_id: `AUDIT-${questionId}`, matter_id: body.matterId, event_type: "COUNSEL_REFERRAL_RECORDED", entity_type: "question", entity_id: questionId, payload: { engagementId, issueId } });
  return NextResponse.json({ counselId, engagementId, briefId, questionId }, { status: 201 });
}
