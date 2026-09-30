import type { MatterBundle } from "@/lib/types/matter";

export type GraphNode = {
  id: string;
  label: string;
  kind: "matter" | "practice_area" | "entity";
  href?: string;
  matterStatus?: string;
  risk?: string;
  openItemCount?: number;
  counselQuestionCount?: number;
  decisionCount?: number;
  actionCount?: number;
  documentCount?: number;
};

export type GraphEdge = { id: string; from: string; to: string; label: string };

export type MatterGraph = { nodes: GraphNode[]; edges: GraphEdge[] };

export function buildMatterGraph(matters: MatterBundle[]): MatterGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  // A linked matter can be encountered first as a lightweight node and later
  // as a full matter bundle. Collapse the input by logical matter ID so the
  // graph never renders the same matter twice.
  const uniqueMatters = Array.from(
    new Map(matters.map((matterData) => [matterData.matter.matter_id, matterData])).values()
  );
  const knownMatterIds = new Set(uniqueMatters.map((matterData) => matterData.matter.matter_id));

  for (const matterData of uniqueMatters) {
    const matter = matterData.matter;
    nodes.push({
      id: matter.matter_id,
      label: matter.matter_title,
      kind: "matter",
      href: `/matters/${matter.matter_id}`,
      matterStatus: matter.matter_status,
      risk: matter.risk_rating,
      openItemCount: matterData.issues?.length ?? 0,
      counselQuestionCount: matterData.counsel_engagements?.flatMap((engagement) => engagement.briefs ?? []).flatMap((brief) => brief.questions ?? []).length ?? 0,
      decisionCount: matterData.decisions?.length ?? 0,
      actionCount: matterData.decisions?.flatMap((decision) => decision.follow_up_actions ?? []).length ?? 0,
      documentCount: [...(matterData.documents ?? []), ...matterData.workstreams.flatMap((workstream) => workstream.documents ?? [])].length,
    });

    const practiceArea = matter.matter_type_id ?? "general";
    if (!seen.has(practiceArea)) {
      seen.add(practiceArea);
      nodes.push({ id: `practice:${practiceArea}`, label: practiceArea.replaceAll("_", " "), kind: "practice_area" });
    }
    edges.push({ id: `area:${practiceArea}:${matter.matter_id}`, from: `practice:${practiceArea}`, to: matter.matter_id, label: "contains" });

    for (const party of [matterData.parties?.client, matterData.parties?.counterparty]) {
      if (!party) continue;
      if (!seen.has(party.party_id)) {
        seen.add(party.party_id);
        nodes.push({ id: party.party_id, label: party.party_name, kind: "entity" });
      }
      edges.push({ id: `party:${matter.matter_id}:${party.party_id}`, from: matter.matter_id, to: party.party_id, label: party.party_type });
    }

    for (const link of matterData.links ?? []) {
      const otherMatterId = link.from_matter_id === matter.matter_id ? link.to_matter_id : link.from_matter_id;
      edges.push({
        id: `matter-link:${link.from_matter_id}:${link.to_matter_id}:${link.link_type}`,
        from: link.from_matter_id,
        to: link.to_matter_id,
        label: link.link_type,
      });
      if (!knownMatterIds.has(otherMatterId) && !nodes.some((node) => node.id === otherMatterId)) {
        nodes.push({ id: otherMatterId, label: otherMatterId, kind: "matter", href: `/matters/${otherMatterId}` });
      }
    }
  }

  return { nodes, edges };
}
