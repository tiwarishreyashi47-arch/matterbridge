import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { verifyCitationQuote } from "@/lib/extraction/citation-matching";

export function verifyQuote(quote: string, pageText: string) {
  return verifyCitationQuote(quote, pageText);
}

export async function verifyAssertionCitation(client: SupabaseClient, assertionId: string, pageId: string, quote: string) {
  const [{ data: page, error: pageError }, { data: assertion, error: assertionError }] = await Promise.all([
    client.from("page").select("*").eq("page_id", pageId).maybeSingle(),
    client.from("assertion").select("*").eq("assertion_id", assertionId).maybeSingle(),
  ]);
  if (pageError) throw new Error(pageError.message);
  if (assertionError) throw new Error(assertionError.message);
  if (!page || !assertion) throw new Error("Assertion or cited page not found.");
  const supported = verifyQuote(quote, page.text_content);
  const citationHash = createHash("sha1").update(`${assertionId}:${quote}`).digest("hex").slice(0, 12);
  const spanId = `SPAN-${assertionId}-${citationHash}`;
  const { error: spanError } = await client.from("span").upsert({ span_id: spanId, page_id: pageId, start_char: 0, end_char: quote.length, text_content: quote }, { onConflict: "span_id" });
  if (spanError) throw new Error(spanError.message);
  const { error: assertionUpdateError } = await client.from("assertion").update({ trust_state: supported ? "SUPPORTED" : "INFERRED" }).eq("assertion_id", assertionId);
  if (assertionUpdateError) throw new Error(assertionUpdateError.message);
  const { error: evidenceError } = await client.from("assertion_evidence").upsert({ assertion_id: assertionId, span_id: spanId, stance: supported ? "supports" : "contradicts" }, { onConflict: "assertion_id,span_id,stance" });
  if (evidenceError) throw new Error(evidenceError.message);
  return { supported, spanId };
}
