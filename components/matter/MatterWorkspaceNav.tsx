import Link from "next/link";

type MatterWorkspaceNavProps = {
  matterId: string;
  active?: "overview" | "documents" | "counsel" | "open-items" | "decisions" | "history" | "stages";
};

const sections = [
  ["overview", "Overview", ""],
  ["documents", "Documents", "/documents"],
  ["counsel", "External Counsel", "/counsel"],
  ["decisions", "Internal Strategy", "/decisions"],
  ["history", "History", "/history"],
] as const;

export default function MatterWorkspaceNav({ matterId, active }: MatterWorkspaceNavProps) {
  return (
    <nav aria-label="Matter workspace" className="mt-5 flex flex-wrap gap-1 border-b border-slate-200 pb-1">
      {sections.map(([key, label, suffix]) => (
        <Link
          key={key}
          href={`/matters/${matterId}${suffix}`}
          aria-current={active === key ? "page" : undefined}
          className={`rounded-t-md px-3 py-2.5 text-sm font-semibold transition ${active === key ? "border-b-2 border-[#263c68] text-[#263c68]" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
