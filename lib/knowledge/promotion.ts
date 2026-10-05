import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

type AssertionLike = { assertion_id: string; matter_id: string; value: unknown; attribute?: string };

type CounselAssertion = AssertionLike & {
  status?: string;
  source_document_ids?: string[];
};

function stableId(prefix: string, value: string) {
  return `${prefix}-${createHash("sha1").update(value).digest("hex").slice(0, 16)}`;
}

export async function promoteAcceptedOpenItem(client: SupabaseClient, assertion: AssertionLike) {
  if (assertion.attribute !== "open_item") return;
  const issueId = `ISSUE-${assertion.assertion_id}`;
  const { error: issueError } = await client.from("issue").upsert({
    issue_id: issueId,
    matter_id: assertion.matter_id,
    issue_title: String(assertion.value),
    issue_description: "Promoted from an approved document extraction.",
    status: "OPEN",
    issue_priority: "MEDIUM",
    requires_legal_judgment: true,
    created_date: new Date().toISOString().slice(0, 10),
  }, { onConflict: "issue_id" });
  if (issueError) throw new Error(issueError.message);
  const { error: basisError } = await client.from("issue_basis").upsert({
    issue_id: issueId,
    assertion_id: assertion.assertion_id,
    basis_type: "approved_extraction",
  }, { onConflict: "issue_id,basis_type,assertion_id,missing_item_key" });
  if (basisError) throw new Error(basisError.message);
  await client.from("audit_event").insert({
    audit_event_id: `AUDIT-${issueId}`,
    matter_id: assertion.matter_id,
    event_type: "OPEN_ITEM_PROMOTED",
    entity_type: "issue",
    entity_id: issueId,
    payload: { assertionId: assertion.assertion_id },
  });
}

/**
 * Promote document-backed counsel metadata only after the lawyer accepts it.
 * The projection uses existing counsel/engagement/brief/question/output tables;
 * it does not create a parallel knowledge schema.
 */
export async function promoteAcceptedCounselAssertions(client: SupabaseClient, assertion: CounselAssertion) {
  if (!assertion.attribute || !["counsel_name", "counsel_date", "counsel_question", "counsel_advice", "counsel_follow_up"].includes(assertion.attribute)) return;
  const { data: rows, error } = await client.from("assertion").select("*").eq("matter_id", assertion.matter_id);
  if (error) throw new Error(error.message);
  const accepted = ((rows ?? []) as CounselAssertion[]).filter((row) => row.status === "accepted");
  const valueFor = (attribute: string) => accepted.find((row) => row.attribute === attribute)?.value;
  const counselName = String(valueFor("counsel_name") ?? "").trim();
  const questionText = String(valueFor("counsel_question") ?? "").trim();
  if (!counselName || !questionText) return;

  const firmName = String(valueFor("counsel_firm") ?? "").trim() || null;
  const counselId = stableId("COUNSEL", `${assertion.matter_id}:${counselName}:${firmName ?? ""}`);
  const engagementId = stableId("ENG", `${assertion.matter_id}:${counselId}`);
  const briefId = stableId("BRIEF", engagementId);
  const questionId = stableId("QUESTION", `${briefId}:${questionText}`);
  const today = new Date().toISOString().slice(0, 10);

  let result = await client.from("counsel").upsert({ counsel_id: counselId, counsel_name: counselName, counsel_type: "EXTERNAL", firm_name: firmName, counsel_status: "ACTIVE" }, { onConflict: "counsel_id" });
  if (result.error) throw new Error(result.error.message);
  result = await client.from("engagement").upsert({ engagement_id: engagementId, matter_id: assertion.matter_id, counsel_id: counselId, engagement_type: "LEGAL_ADVICE", engagement_status: "ENGAGED", engagement_description: "Projected from accepted counsel metadata.", engagement_date: String(valueFor("counsel_date") ?? today) }, { onConflict: "engagement_id" });
  if (result.error) throw new Error(result.error.message);
  result = await client.from("brief").upsert({ brief_id: briefId, engagement_id: engagementId, brief_title: questionText.slice(0, 120), brief_status: "OPEN", brief_date: today }, { onConflict: "brief_id" });
  if (result.error) throw new Error(result.error.message);

  // Keep the relationship unknown unless an explicit issue_id was persisted.
  // This preserves the canonical contract's no-fabrication rule.
  result = await client.from("question").upsert({ question_id: questionId, brief_id: briefId, issue_id: null, question_text: questionText, question_category: "LEGAL_ADVICE", question_priority: "MEDIUM", created_date: today }, { onConflict: "question_id" });
  if (result.error) throw new Error(result.error.message);

  const advice = String(valueFor("counsel_advice") ?? "").trim();
  const followUp = String(valueFor("counsel_follow_up") ?? "").trim();
  if (advice) {
    const outputId = stableId("OUTPUT", `${engagementId}:${advice}`);
    const summary = followUp ? `${advice} Recommended follow-up: ${followUp}` : advice;
    result = await client.from("counsel_output").upsert({ output_id: outputId, engagement_id: engagementId, brief_id: briefId, output_type: "WRITTEN_ADVICE", output_status: "RECEIVED", opinion_summary: summary, output_date: today, opinion_sections: [], review_points: [] }, { onConflict: "output_id" });
    if (result.error) throw new Error(result.error.message);
  }
  await client.from("audit_event").upsert({ audit_event_id: stableId("AUDIT-COUNSEL", `${assertion.matter_id}:${engagementId}`), matter_id: assertion.matter_id, event_type: "COUNSEL_PROJECTION_CREATED", entity_type: "engagement", entity_id: engagementId, payload: { sourceAssertionId: assertion.assertion_id, questionId, adviceProjected: Boolean(advice) } }, { onConflict: "audit_event_id" });
}
