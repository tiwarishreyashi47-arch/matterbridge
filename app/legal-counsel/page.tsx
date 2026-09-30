import Link from "next/link";
import LegalCounselWorkspace from "@/components/legal-counsel/LegalCounselWorkspace";

export default function LegalCounselPage() {
  return <main className="min-h-screen text-slate-950"><div className="page-frame"><Link href="/" className="text-sm font-semibold text-slate-500 hover:text-[#263c68]">Back to matters</Link><header className="surface-card mt-5 rounded-xl p-7"><p className="eyebrow text-[#263c68]">Department knowledge</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Legal Counsel</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">A structured-first counsel workspace over the canonical knowledge of every matter. RAG and narrative synthesis can be added after retrieval and trust contracts are proven.</p></header><LegalCounselWorkspace /></div></main>;
}
