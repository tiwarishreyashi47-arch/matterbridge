"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Legal Matter Intelligence", shortLabel: "Matters", icon: "▦" },
  { href: "/legal-counsel", label: "Legal Counsel", shortLabel: "Counsel", icon: "◫" },
  { href: "/workspace", label: "Your Legal Workspace", shortLabel: "Workspace", icon: "✓" },
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
    <aside className="w-full shrink-0 border-b border-[#dfdfda] bg-[#f8f7f3] lg:sticky lg:top-0 lg:h-screen lg:w-[15.5rem] lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col px-4 py-4 lg:px-4 lg:py-6">
        <Link href="/" className="flex items-center gap-3 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#263c68] text-xs font-bold text-white">
            MB
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-tight text-[#20252d]">
              MatterBridge
            </span>
            <span className="block text-[10px] font-medium text-[#7a7e84]">
              Matter intelligence
            </span>
          </span>
        </Link>

        <div className="mt-9 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          <p className="hidden px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#969995] lg:block">
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
                    ? "bg-[#e9e9e4] text-[#20252d]"
                    : "text-[#6b7077] hover:bg-[#efeee9] hover:text-[#20252d]")
                }
              >
                <span
                  className={
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm " +
                    (active
                      ? "bg-[#d9dfeb] text-[#263c68]"
                      : "bg-[#ebeae5] text-[#7d8288] group-hover:text-[#20252d]")
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

        <div className="mt-auto hidden border-t border-[#dfdfda] pt-4 lg:block">
          <p className="text-xs font-semibold text-[#4b5159]">Workspace</p>
          <p className="mt-1 text-xs leading-5 text-[#858a8f]">
            Matter context, evidence, counsel work, and internal strategy in one place.
          </p>
        </div>
      </div>
    </aside>
  );
}
