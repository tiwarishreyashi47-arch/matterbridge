import { NextResponse } from "next/server";
import { getAllMatterKnowledge } from "@/lib/data/knowledge-service";

function tokens(value: string) {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { query?: string } | null;
  const query = body?.query?.trim();
  if (!query) return NextResponse.json({ error: "query is required." }, { status: 400 });
  const queryTokens = tokens(query);
  const matters = await getAllMatterKnowledge();
  const matches = matters.map((matter) => {
    const openItems = matter.openItems.filter((item) => {
      const text = `${item.title} ${item.description ?? ""}`.toLowerCase();
      return queryTokens.some((token) => text.includes(token));
    });
    const pendingCounsel = matter.externalCounsel.flatMap((engagement) => engagement.deliverables.filter((deliverable) => deliverable.status === "pending"));
    const score = openItems.length * 3 + (queryTokens.some((token) => matter.context.title.toLowerCase().includes(token)) ? 2 : 0) + pendingCounsel.length;
    return { matter, openItems, pendingCounsel, score };
  }).filter((match) => match.score > 0).sort((a, b) => b.score - a.score);
  return NextResponse.json({
    query,
    mode: "structured_canonical_knowledge",
    answer: matches.length ? `Found ${matches.length} matter${matches.length === 1 ? "" : "s"} with matching canonical knowledge.` : "No matching canonical matter knowledge was found.",
    matches: matches.slice(0, 12).map(({ matter, openItems, pendingCounsel }) => ({
      matterId: matter.matterId,
      title: matter.context.title,
      status: matter.currentStatus,
      openItems: openItems.map((item) => ({ id: item.id, title: item.title, description: item.description, provenance: item.provenance })),
      pendingCounsel: pendingCounsel.map((deliverable) => ({ id: deliverable.id, label: deliverable.label, provenance: deliverable.provenance })),
      decisions: matter.decisions.slice(0, 3).map((decision) => ({ id: decision.id, title: decision.title, summary: decision.summary, provenance: decision.provenance })),
      sources: matter.sources.slice(0, 8),
    })),
  });
}
