import knowledgeChunks from "@/data/knowledge_chunks.json";
import type {
  AIFinding,
  EvidencePacket,
  EvidencePacketSource,
  KnowledgeChunk,
  LegalIssue,
  MatterBundle,
  Workstream,
} from "@/lib/types/matter";

const chunks = knowledgeChunks as KnowledgeChunk[];

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "before",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function joinText(values: Array<string | undefined | null>) {
  return values.filter(Boolean).join(" ");
}

function issueText(issue: LegalIssue) {
  return joinText([
    issue.issue_title,
    issue.issue_description,
    issue.issue_priority,
    issue.issue_status,
  ]);
}

function findingText(finding: AIFinding) {
  return joinText([
    finding.finding_type,
    finding.finding_title,
    finding.finding_summary,
  ]);
}

function chunkSearchText(chunk: KnowledgeChunk) {
  return joinText([
    chunk.document_title,
    chunk.document_type,
    chunk.section_title,
    chunk.text,
    chunk.citation_label,
    ...(chunk.asset_ids ?? []),
  ]).toLowerCase();
}

function scoreChunk(chunk: KnowledgeChunk, queryTokens: string[]) {
  const haystack = chunkSearchText(chunk);
  let score = 0;

  for (const token of queryTokens) {
    if (haystack.includes(token)) {
      score += 1;
    }

    if (chunk.section_title?.toLowerCase().includes(token)) {
      score += 1;
    }

    if (chunk.document_title?.toLowerCase().includes(token)) {
      score += 1;
    }
  }

  return score;
}

function toSource(chunk: KnowledgeChunk, score: number): EvidencePacketSource {
  return {
    chunk_id: chunk.chunk_id,
    matter_id: chunk.matter_id,
    workstream_id: chunk.workstream_id,
    document_id: chunk.document_id,
    document_title: chunk.document_title,
    document_type: chunk.document_type,
    section_title: chunk.section_title,
    citation_label: chunk.citation_label,
    text: chunk.text,
    score,
  };
}

function guardrailsFor(matterData: MatterBundle, workstream?: Workstream) {
  const guardrails = [
    "Use only cited source or chunk IDs for supported statements.",
    "Separate supported facts, missing information, and legal judgment.",
    "Do not use confidence percentages.",
  ];

  if (matterData.matter.matter_id === "MAT-001") {
    guardrails.push(
      "Do not give a final title opinion or definitive enforcement-route conclusion."
    );
  }

  if (matterData.matter.matter_id === "MAT-002") {
    guardrails.push(
      "Keep performance history, document verification, and sensitive leave context separate."
    );
    guardrails.push(
      "Do not infer termination from attendance history plus document inconsistencies."
    );
  }

  if (workstream?.workstream_name === "Security Verification") {
    guardrails.push(
      "Treat unresolved prior mortgage and release evidence as verification issues for counsel."
    );
  }

  return guardrails;
}

function buildRetrievalQuery(matterData: MatterBundle, workstream?: Workstream) {
  const scopedIssues = workstream?.issues ?? matterData.issues ?? [];
  const scopedFindings = workstream?.findings ?? matterData.findings ?? [];
  const counselQuestions =
    matterData.counsel_engagements?.flatMap((engagement) =>
      engagement.briefs?.flatMap((brief) =>
        brief.questions?.map((question) => question.question_text) ?? []
      ) ?? []
    ) ?? [];

  return joinText([
    matterData.matter.matter_title,
    matterData.matter.matter_description,
    matterData.matter_type?.matter_type_name,
    workstream?.workstream_name,
    workstream?.workstream_description,
    ...scopedIssues.map(issueText),
    ...scopedFindings.map(findingText),
    ...counselQuestions,
  ]);
}

export function buildEvidencePacket(
  matterData: MatterBundle,
  options: {
    workstream?: Workstream;
    maxSources?: number;
  } = {}
): EvidencePacket {
  const { workstream, maxSources = 6 } = options;
  const retrievalQuery = buildRetrievalQuery(matterData, workstream);
  const queryTokens = Array.from(new Set(tokenize(retrievalQuery)));
  const scopedChunks = chunks.filter((chunk) => {
    if (chunk.matter_id !== matterData.matter.matter_id) {
      return false;
    }

    if (workstream && chunk.workstream_id !== workstream.workstream_id) {
      return false;
    }

    return true;
  });

  const scoredSources = scopedChunks
    .map((chunk) => toSource(chunk, scoreChunk(chunk, queryTokens)))
    .filter((source) => source.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.chunk_id.localeCompare(b.chunk_id);
    });

  const fallbackSources = scopedChunks
    .map((chunk) => toSource(chunk, 0))
    .sort((a, b) => a.chunk_id.localeCompare(b.chunk_id));

  return {
    scope: workstream ? "workstream" : "matter",
    matter_id: matterData.matter.matter_id,
    workstream_id: workstream?.workstream_id,
    retrieval_query: retrievalQuery,
    sources: (scoredSources.length > 0 ? scoredSources : fallbackSources).slice(
      0,
      maxSources
    ),
    required_output_states: [
      "SUPPORTED",
      "INFERRED",
      "INFORMATION_MISSING",
      "REQUIRES_LEGAL_JUDGMENT",
    ],
    guardrails: guardrailsFor(matterData, workstream),
  };
}
