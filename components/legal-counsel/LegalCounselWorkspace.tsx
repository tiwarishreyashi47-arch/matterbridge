"use client";

import Link from "next/link";
import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };
type Result = { answer: string; mode: string; followUpQuestions: string[]; navigation: { label: string; href: string }[] };

const starterQuestions = ["What is preventing enforcement?", "Which matters have unresolved legal issues?", "What did external counsel advise?"];

export default function LegalCounselWorkspace() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask(question = query) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setLoading(true); setError(""); setQuery("");
    try {
      const response = await fetch("/api/legal-counsel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: trimmed, messages }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Counsel query failed.");
      setMessages((current) => [...current, { role: "user", content: trimmed }, { role: "assistant", content: payload.answer }]);
      setResult(payload);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Counsel query failed."); }
    finally { setLoading(false); }
  }

  function submit(event: React.FormEvent) { event.preventDefault(); void ask(); }

  return <section className="mx-auto mt-7 max-w-4xl">
    <div className="surface-card overflow-hidden rounded-2xl">
      <header className="border-b border-slate-200 px-6 py-5 sm:px-8"><p className="eyebrow text-[#263c68]">Legal Counsel</p><h2 className="mt-1 text-2xl font-semibold">Ask across matters</h2><p className="mt-2 text-sm text-slate-500">Ask questions about your matters, documents, open items, counsel advice, and internal strategy.</p></header>
      <div className="min-h-[430px] bg-white px-4 py-6 sm:px-8">
        {!messages.length && !loading ? <div className="flex min-h-[330px] flex-col items-center justify-center text-center"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#263c68] text-xl font-semibold text-white">LC</div><h3 className="mt-5 text-xl font-semibold text-slate-900">How can I help with your legal matters?</h3><p className="mt-2 max-w-md text-sm leading-6 text-slate-500">I’ll answer from the matter records and guide you to the relevant matter when you want to inspect the detail.</p><div className="mt-6 flex flex-wrap justify-center gap-2">{starterQuestions.map((question) => <button key={question} type="button" onClick={() => void ask(question)} className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-[#263c68] hover:text-[#263c68]">{question}</button>)}</div></div> : <div className="space-y-5">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}><div className={message.role === "user" ? "max-w-[85%] rounded-2xl rounded-br-sm bg-[#263c68] px-4 py-3 text-sm leading-6 text-white" : "max-w-[90%] rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 text-sm leading-7 text-slate-800"}><p className="mb-1 text-[11px] font-semibold uppercase tracking-wider opacity-60">{message.role === "user" ? "You" : "Legal Counsel"}</p>{message.content}</div></div>)}{loading ? <div className="flex justify-start"><div className="rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 text-sm text-slate-500">Reviewing matter records…</div></div> : null}{error ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</div> : null}</div>}
        {result && !loading ? <div className="mt-6 space-y-4 border-t border-slate-100 pt-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Continue the conversation</p><div className="mt-2 flex flex-wrap gap-2">{result.followUpQuestions.map((question) => <button key={question} type="button" onClick={() => void ask(question)} className="rounded-full bg-blue-50 px-3 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-100">{question}</button>)}</div></div>{result.navigation.length ? <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Related matter paths</p><div className="mt-2 flex flex-wrap gap-2">{result.navigation.map((link) => <Link key={link.href} href={link.href} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-[#263c68] hover:border-[#263c68]">{link.label} →</Link>)}</div></div> : null}</div> : null}
      </div>
      <form onSubmit={submit} className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5"><div className="flex items-end gap-3 rounded-xl border border-slate-300 bg-white p-2 shadow-sm"><textarea aria-label="Message Legal Counsel" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void ask(); } }} placeholder="Message Legal Counsel…" rows={1} className="max-h-32 min-h-11 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm outline-none" /><button type="submit" disabled={loading || !query.trim()} className="rounded-lg bg-[#263c68] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40">Send</button></div><p className="mt-2 text-center text-xs text-slate-400">Legal Counsel summarizes recorded matter knowledge. It does not create new legal advice.</p></form>
    </div>
  </section>;
}
