import type { RetrievalHit, DocumentRetrievalHit } from "@/lib/data/retrieval-service";

export type LocalMatterMatch = {
  matterId: string;
  title: string;
  hits: RetrievalHit[];
  documentHits: DocumentRetrievalHit[];
};

export type CounselNavigation = { label: string; href: string; matterId: string };

export type LocalCounselResponse = {
  answer: string;
  followUpQuestions: string[];
  navigation: CounselNavigation[];
  evidence: Array<RetrievalHit | DocumentRetrievalHit>;
};

function firstHit(matches: LocalMatterMatch[], kind: RetrievalHit["kind"]) {
  return matches.flatMap((match) => match.hits).find((hit) => hit.kind === kind);
}

export function synthesizeLocalCounselResponse(query: string, matches: LocalMatterMatch[]): LocalCounselResponse {
  const evidence = matches.flatMap((match) => [...match.hits, ...match.documentHits]).sort((a, b) => b.score - a.score).slice(0, 12);
  if (!matches.length || !evidence.length) {
    return {
      answer: `I could not find grounded evidence for “${query}” in the current matter records. Try asking about a specific matter, open item, counsel response, decision, or document.`,
      followUpQuestions: ["Which matters have unresolved open items?", "What has external counsel advised?"],
      navigation: [],
      evidence: [],
    };
  }

  const matterLabel = matches.length === 1 ? `In ${matches[0].title}` : `Across ${matches.length} matters`;
  const openItem = firstHit(matches, "open_item");
  const advice = firstHit(matches, "counsel_advice");
  const decision = firstHit(matches, "decision");
  const fact = firstHit(matches, "fact");
  const clauses = [
    openItem ? `the main unresolved issue is ${openItem.text.replace(/^open_item:\s*/i, "")}` : undefined,
    advice ? `external counsel advised: ${advice.text.replace(/^counsel_advice:\s*/i, "")}` : undefined,
    decision ? `the recorded internal strategy is ${decision.text.replace(/^internal strategy:\s*/i, "")}` : undefined,
    !openItem && fact ? `the strongest current fact is ${fact.text}` : undefined,
  ].filter(Boolean);
  const documentCount = matches.reduce((count, match) => count + match.documentHits.length, 0);
  const answer = `${matterLabel}, ${clauses.join(". ")}${clauses.length ? "." : ""} Supporting documentary passages retrieved: ${documentCount}. This is a grounded summary of recorded matter knowledge, not a new legal conclusion.`;
  const matterId = matches[0].matterId;
  const navigation: CounselNavigation[] = [
    { label: "Open matter overview", href: `/matters/${matterId}`, matterId },
    openItem ? { label: "Open unresolved items", href: `/matters/${matterId}/open-items#${openItem.id}`, matterId } : undefined,
    advice ? { label: "Open external counsel", href: `/matters/${matterId}/counsel`, matterId } : undefined,
    decision ? { label: "Open internal strategy", href: `/matters/${matterId}/decisions`, matterId } : undefined,
  ].filter((link): link is CounselNavigation => Boolean(link));
  const followUpQuestions = [
    openItem ? "What evidence supports this unresolved issue?" : "Which open items are still unresolved?",
    advice ? "What did external counsel recommend as the next step?" : "Is any external counsel advice recorded?",
    decision ? "What internal action was decided?" : "Has the organisation recorded an internal strategy?",
  ];
  return { answer, followUpQuestions, navigation, evidence };
}
