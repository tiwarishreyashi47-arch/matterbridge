"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Legal Matter Intelligence", shortLabel: "Matters", icon: "▦" },
  { href: "/evidence", label: "Documentary Evidence", shortLabel: "Evidence", icon: "▤" },
  {
    href: "/counsel-review",
    label: "Overall Counsel Engagement Review",
    shortLabel: "Counsel Review",
    icon: "◫",
  },
  { href: "/settings", label: "Settings", shortLabel: "Settings", icon: "⚙" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/matters");
  }

  return pathname === href || pathname.startsWith(href + "/");
}

export default function PrimaryNavigation() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col px-4 py-4 lg:px-5 lg:py-6">
        <Link href="/" className="flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
            M
          </span>
          <span>
            <span className="block text-sm font-bold tracking-tight text-slate-950">
              MatterBridge
            </span>
            <span className="block text-[11px] font-medium text-slate-500">
              Legal operations
            </span>
          </span>
        </Link>

        <div className="mt-6 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          <p className="hidden px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 lg:block">
            Workspace
          </p>
          {links.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={
                  "group flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition lg:w-full lg:min-w-0 " +
                  (active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950")
                }
              >
                <span
                  className={
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm " +
                    (active
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-500 group-hover:text-slate-700")
                  }
                  aria-hidden="true"
                >
                  {link.icon}
                </span>
                <span className="lg:hidden">{link.shortLabel}</span>
                <span className="hidden min-w-0 flex-1 leading-5 lg:block">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto hidden rounded-lg border border-slate-200 bg-slate-50 p-3 lg:block">
          <p className="text-xs font-semibold text-slate-700">Prototype workspace</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Matter context, evidence, counsel work, and decisions in one place.
          </p>
        </div>
      </div>
    </aside>
  );
}
