import type {
  AIFinding,
  Document,
  EvidencePacketSource,
  LegalIssue,
} from "@/lib/types/matter";

export interface IssueSupport {
  issue: LegalIssue;
  findings: AIFinding[];
  documents: Document[];
  evidence: EvidencePacketSource[];
}

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
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

function tokens(text: string) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2 && !stopWords.has(token))
  );
}

function overlapScore(sourceTokens: Set<string>, targetText: string) {
  const targetTokens = tokens(targetText);
  return [...sourceTokens].filter((token) => targetTokens.has(token)).length;
}

function findingText(finding: AIFinding) {
  return [
    finding.finding_type,
    finding.finding_title,
    finding.finding_summary,
  ]
    .filter(Boolean)
    .join(" ");
}

function documentText(document: Document) {
  return [
    document.document_title,
    document.document_type,
    ...(document.sections ?? []).flatMap((section) => [
      section.section_title,
      section.section_content,
    ]),
  ].join(" ");
}

function sourceText(source: EvidencePacketSource) {
  return [
    source.document_title,
    source.document_type,
    source.section_title,
    source.text,
  ]
    .filter(Boolean)
    .join(" ");
}

function relatedFindings(issue: LegalIssue, findings: AIFinding[]) {
  const issueTokens = tokens(
    [issue.issue_title, issue.issue_description].filter(Boolean).join(" ")
  );

  return findings
    .filter(
      (finding) =>
        finding.matter_id === issue.matter_id &&
        finding.workstream_id === issue.workstream_id
    )
    .map((finding) => ({
      finding,
      score: overlapScore(issueTokens, findingText(finding)),
    }))
    .filter(({ finding, score }) => {
      const titleScore = overlapScore(
        tokens(issue.issue_title),
        [finding.finding_title, finding.finding_type].filter(Boolean).join(" ")
      );

      return score >= 2 || titleScore >= 1;
    })
    .sort((a, b) => b.score - a.score)
    .map(({ finding }) => finding);
}

function relatedDocuments(
  issue: LegalIssue,
  findings: AIFinding[],
  documents: Document[]
) {
  const issueTokens = tokens(
    [issue.issue_title, issue.issue_description].filter(Boolean).join(" ")
  );
  const citedDocumentIds = new Set(
    findings.flatMap(
      (finding) =>
        finding.citations
          ?.filter((citation) => citation.source_type === "DOCUMENT")
          .map((citation) => citation.source_id) ?? []
    )
  );

  return documents
    .filter(
      (document) =>
        document.matter_id === issue.matter_id &&
        document.workstream_id === issue.workstream_id
    )
    .map((document) => ({
      document,
      score:
        (citedDocumentIds.has(document.document_id) ? 4 : 0) +
        overlapScore(issueTokens, documentText(document)),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ document }) => document);
}

function relatedEvidence(
  issue: LegalIssue,
  documents: Document[],
  sources: EvidencePacketSource[]
) {
  const issueTokens = tokens(
    [issue.issue_title, issue.issue_description].filter(Boolean).join(" ")
  );
  const documentIds = new Set(documents.map((document) => document.document_id));

  return sources
    .filter(
      (source) =>
        source.matter_id === issue.matter_id &&
        source.workstream_id === issue.workstream_id &&
        source.document_id &&
        documentIds.has(source.document_id)
    )
    .map((source) => ({
      source,
      score: overlapScore(issueTokens, sourceText(source)),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return b.source.score - a.source.score;
    })
    .slice(0, 8)
    .map(({ source }) => source);
}

export function mapIssuesToSupport(
  issues: LegalIssue[],
  findings: AIFinding[],
  documents: Document[],
  sources: EvidencePacketSource[]
): IssueSupport[] {
  return issues
    .filter(
      (issue) => issue.issue_status === "ACTIVE" || issue.issue_status === "IN_PROGRESS"
    )
    .map((issue) => {
      const issueFindings = relatedFindings(issue, findings);
      const issueDocuments = relatedDocuments(issue, issueFindings, documents);

      return {
        issue,
        findings: issueFindings,
        documents: issueDocuments,
        evidence: relatedEvidence(issue, issueDocuments, sources),
      };
    });
}
