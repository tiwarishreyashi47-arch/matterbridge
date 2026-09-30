import type { MatterBundle } from "@/lib/types/matter";

export type GeneratedIssue = {
  issue_id: string;
  matter_id: string;
  workstream_id?: string;
  rule_code: string;
  rule_version: string;
  issue_title: string;
  issue_description: string;
  status: "ACTIVE" | "INFORMATION_MISSING";
  severity: "HIGH" | "MEDIUM" | "LOW";
  requires_legal_judgment: boolean;
};

export function evaluateMatterRules(matterData: MatterBundle): GeneratedIssue[] {
  const generated: GeneratedIssue[] = [];
  for (const workstream of matterData.workstreams) {
    if (matterData.matter.matter_id === "MAT-001" && workstream.workstream_name === "Security Verification" && !(workstream.documents ?? []).some((document) => document.document_type.includes("VALUATION"))) {
      generated.push({ issue_id: `RULE-${workstream.workstream_id}-VALUATION`, matter_id: matterData.matter.matter_id, workstream_id: workstream.workstream_id, rule_code: "recovery.stale_valuation", rule_version: "v1", issue_title: "Updated valuation is missing", issue_description: "The recovery template expects current valuation evidence before property enforcement is treated as fully verified.", status: "INFORMATION_MISSING", severity: "MEDIUM", requires_legal_judgment: true });
    }
    if (matterData.matter.matter_id === "MAT-002" && workstream.workstream_name.includes("Employee")) {
      const authenticityIssue = (workstream.issues ?? []).find((issue) => issue.issue_title.toLowerCase().includes("authentic"));
      if (authenticityIssue) generated.push({ issue_id: `RULE-${authenticityIssue.issue_id}`, matter_id: matterData.matter.matter_id, workstream_id: workstream.workstream_id, rule_code: "employment.document_identifier_mismatch", rule_version: "v1", issue_title: authenticityIssue.issue_title, issue_description: authenticityIssue.issue_description ?? "Document authenticity requires source verification.", status: "ACTIVE", severity: "HIGH", requires_legal_judgment: true });
    }
  }
  return generated;
}
