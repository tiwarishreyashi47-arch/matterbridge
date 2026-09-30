import { NextResponse } from "next/server";
import { getMatterKnowledge } from "@/lib/data/knowledge-service";

export async function GET(_request: Request, { params }: { params: Promise<{ matterId: string }> }) {
  const { matterId } = await params;
  const knowledge = await getMatterKnowledge(matterId);
  return knowledge ? NextResponse.json(knowledge) : NextResponse.json({ error: "Matter not found." }, { status: 404 });
}
