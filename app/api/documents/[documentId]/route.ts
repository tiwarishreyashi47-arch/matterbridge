import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function DELETE(_request: Request, { params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params;
  const client = createSupabaseServerClient();
  const { data: document, error: documentLookupError } = await client.from("document").select("document_id").eq("document_id", documentId).maybeSingle();
  if (documentLookupError) return NextResponse.json({ error: documentLookupError.message }, { status: 502 });
  if (!document) return NextResponse.json({ error: "Document not found." }, { status: 404 });

  // Keep the source and extraction history auditable while removing the
  // document from the active workspace. This avoids requiring DELETE grants
  // on assertion/page tables during local prototyping.
  const { error: removeError } = await client.from("document").update({ document_status: "removed", file_path: null }).eq("document_id", documentId);
  if (removeError) return NextResponse.json({ error: removeError.message }, { status: 502 });
  return NextResponse.json({ documentId, removed: true, mode: "archived" });
}
