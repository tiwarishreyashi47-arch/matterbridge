import type { Assertion } from "@/lib/types/matter";
import { canonicalFieldKey } from "@/lib/knowledge/field-registry";

export function currentFacts(assertions: Assertion[]) {
  return assertions.filter((assertion) => ["accepted", "proposed"].includes(assertion.status)).sort((a, b) => {
    const sourceRank = (source: string) => source === "user" ? 0 : 1;
    const statusRank = (status: string) => status === "accepted" ? 0 : 1;
    const timestampRank = (assertion: Assertion) => assertion.updated_at ?? assertion.created_at ?? "";
    return sourceRank(a.source) - sourceRank(b.source) || statusRank(a.status) - statusRank(b.status) || timestampRank(b).localeCompare(timestampRank(a)) || a.assertion_id.localeCompare(b.assertion_id);
  }).filter((assertion, index, all) => all.findIndex((candidate) => canonicalFieldKey(candidate.attribute) === canonicalFieldKey(assertion.attribute) && candidate.entity_id === assertion.entity_id) === index);
}
