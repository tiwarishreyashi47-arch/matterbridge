import { NextResponse } from "next/server";
import { buildEvidencePacket } from "@/lib/data/evidence-service";
import { getMatter } from "@/lib/data/matter-service";

const reviewSchema = {
  type: "object",
  properties: {
    overall_assessment: { type: "string" },
    review_points: {
      type: "array",
      items: {
        type: "object",
        properties: {
          review_type: { type: "string" },
          title: { type: "string" },
          severity: { type: "string" },
          counsel_position: { type: "string" },
          company_review: { type: "string" },
          recommended_action: { type: "string" },
          source_ids: { type: "array", items: { type: "string" } },
        },
        required: [
          "review_type",
          "title",
          "severity",
          "counsel_position",
          "company_review",
          "recommended_action",
          "source_ids",
        ],
      },
    },
  },
  required: ["overall_assessment", "review_points"],
};

function parseReview(text: string) {
  if (!text) {
    throw new Error("The model returned no structured review output.");
  }

  return JSON.parse(text) as {
    overall_assessment: string;
    review_points: Array<{
      review_type: string;
      title: string;
      severity: string;
      counsel_position: string;
      company_review: string;
      recommended_action: string;
      source_ids: string[];
    }>;
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        code: "CONFIGURATION_MISSING",
        error: "Live review is not configured. Add GEMINI_API_KEY on the server to enable it.",
      },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as { matterId?: string } | null;
  const matterId = body?.matterId ?? "MAT-001";
  const matterData = getMatter(matterId);

  if (!matterData) {
    return NextResponse.json({ code: "MATTER_NOT_FOUND", error: "Matter not found." }, { status: 404 });
  }

  const engagement = matterData.counsel_engagements?.[0];
  const output = engagement?.outputs?.[0];
  const workstream = matterData.workstreams.find(
    (candidate) => candidate.workstream_name === "Recovery Assessment"
  );

  if (!output || !workstream) {
    return NextResponse.json(
      { code: "REVIEW_CONTEXT_MISSING", error: "Counsel review context is incomplete for this matter." },
      { status: 422 }
    );
  }

  const packet = buildEvidencePacket(matterData, { workstream, maxSources: 24 });
  const allowedSourceIds = [
    output.output_id,
    ...(output.opinion_sections ?? []).map((section) => section.opinion_section_id),
    ...packet.sources.flatMap((source) => [source.chunk_id, source.document_id].filter(Boolean)),
    ...(matterData.historical_precedents ?? []).map((precedent) => precedent.historical_matter_id),
    ...(matterData.issues ?? []).map((issue) => issue.issue_id),
    ...(matterData.findings ?? []).map((finding) => finding.finding_id),
  ];

  const prompt = JSON.stringify({
    task: "Review external counsel advice against the company's evidence and historical precedent.",
    constraints: [
      "Do not give a final legal opinion or make the legal decision for Internal Legal.",
      "Distinguish counsel position from company evidence and legal judgment.",
      "Only use source IDs from allowed_source_ids.",
      "Do not invent confidence percentages or facts.",
      "If evidence is missing, say so explicitly.",
    ],
    allowed_source_ids: allowedSourceIds,
    counsel_output: output,
    relevant_issues: workstream.issues ?? [],
    relevant_findings: workstream.findings ?? [],
    evidence_packet: packet.sources,
    relevant_precedents: matterData.historical_precedents ?? [],
  });

  try {
    const model = process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "You are MatterBridge, an evidence-grounded legal operations review assistant.",
            },
          ],
        },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: reviewSchema,
        },
      }),
      }
    );

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
      error?: { message?: string };
    };

    if (!response.ok) {
      return NextResponse.json(
        { code: "MODEL_REQUEST_FAILED", error: payload.error?.message ?? "The model request failed." },
        { status: 502 }
      );
    }

    const modelText = payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("");
    const review = parseReview(modelText ?? "");
    const allowed = new Set(allowedSourceIds);
    const invalidSourceIds = review.review_points.flatMap((point) =>
      point.source_ids.filter((sourceId) => !allowed.has(sourceId))
    );

    if (invalidSourceIds.length > 0) {
      return NextResponse.json(
        { code: "INVALID_CITATIONS", error: "The model returned a source ID outside the retrieved evidence scope." },
        { status: 502 }
      );
    }

    return NextResponse.json({ review, source_ids: allowedSourceIds });
  } catch {
    return NextResponse.json(
      { code: "MODEL_OUTPUT_INVALID", error: "The live review could not be validated. Existing review data remains available." },
      { status: 502 }
    );
  }
}
