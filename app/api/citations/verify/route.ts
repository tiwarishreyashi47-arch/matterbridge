import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifyAssertionCitation } from "@/lib/extraction/citation-verifier";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { assertionId?: string; pageId?: string; quote?: string } | null;
  if (!body?.assertionId || !body.pageId || !body.quote) return NextResponse.json({ error: "assertionId, pageId, and quote are required." }, { status: 400 });
  try {
    return NextResponse.json(await verifyAssertionCitation(createSupabaseServerClient(), body.assertionId, body.pageId, body.quote));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Citation verification failed." }, { status: 502 });
  }
}
