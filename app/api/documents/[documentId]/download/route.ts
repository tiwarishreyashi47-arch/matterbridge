import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params;
  const client = createSupabaseServerClient();
  const { data: document, error } = await client.from("document").select("file_path,document_title").eq("document_id", documentId).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });
  if (!document?.file_path) return NextResponse.json({ error: "Original document is not available." }, { status: 404 });
  const { data: signed, error: signedError } = await client.storage.from("matter-documents").createSignedUrl(document.file_path as string, 3600);
  if (signedError || !signed?.signedUrl) return NextResponse.json({ error: signedError?.message ?? "Document link could not be created." }, { status: 502 });
  return NextResponse.redirect(signed.signedUrl);
}
