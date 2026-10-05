import { NextResponse } from "next/server";
import { getAllMatterKnowledge, getMatterKnowledge } from "@/lib/data/knowledge-service";
import { getAllMatters, getMatter } from "@/lib/data/matter-service";
import { retrieveDocumentSections, retrieveMatterKnowledge } from "@/lib/data/retrieval-service";
import { synthesizeLocalCounselResponse } from "@/lib/rag/local-synthesis";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { query?: string; matterId?: string; messages?: { role: "user" | "assistant"; content: string }[] } | null;
  const query = body?.query?.trim();
  if (!query) return NextResponse.json({ error: "query is required." }, { status: 400 });
  const priorUserContext = (body?.messages ?? []).filter((message) => message.role === "user").slice(-2).map((message) => message.content).join(" ");
  const retrievalQuery = priorUserContext ? `${priorUserContext} ${query}` : query;
  const matters = body?.matterId ? [await getMatterKnowledge(body.matterId)].filter(Boolean) : await getAllMatterKnowledge();
  const bundles = body?.matterId ? [await getMatter(body.matterId)].filter(Boolean) : await getAllMatters();
  const matches = matters.map((matter) => {
    const bundle = bundles.find((candidate) => candidate?.matter.matter_id === matter?.matterId);
    const hits = retrieveMatterKnowledge(matter!, retrievalQuery);
    const documentHits = bundle ? retrieveDocumentSections(bundle, retrievalQuery) : [];
    return { matter: matter!, hits, documentHits };
  })
    .map((match) => ({ ...match, score: [...match.hits, ...match.documentHits].reduce((sum, hit) => sum + hit.score, 0) }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
  const localResponse = synthesizeLocalCounselResponse(query, matches.map(({ matter, hits, documentHits }) => ({ matterId: matter.matterId, title: matter.context.title, hits, documentHits })));
  return NextResponse.json({
    query,
    mode: "local_conversational_grounded_retrieval",
    answer: localResponse.answer,
    followUpQuestions: localResponse.followUpQuestions,
    navigation: localResponse.navigation,
    evidence: localResponse.evidence,
    conversation: { messages: [...(body?.messages ?? []), { role: "user", content: query }, { role: "assistant", content: localResponse.answer }] },
    matches: matches.map(({ matter, hits, documentHits }) => ({
      matterId: matter.matterId,
      title: matter.context.title,
      status: matter.currentStatus,
      hits,
      documentHits,
      openItems: matter.openItems.filter((item) => hits.some((hit) => hit.kind === "open_item" && hit.id === item.id)).map((item) => ({ id: item.id, title: item.title, description: item.description, provenance: item.provenance })),
      pendingCounsel: matter.externalCounsel.flatMap((engagement) => engagement.deliverables.filter((deliverable) => deliverable.status === "pending")).map((deliverable) => ({ id: deliverable.id, label: deliverable.label, provenance: deliverable.provenance })),
      decisions: matter.decisions.slice(0, 3).map((decision) => ({ id: decision.id, title: decision.title, summary: decision.summary, provenance: decision.provenance })),
      sources: matter.sources.slice(0, 8),
    })),
  });
}
