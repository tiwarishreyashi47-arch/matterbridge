"use client";

import { useState } from "react";
import MatterCard from "@/components/matter/MatterCard";
import type { MatterBundle } from "@/lib/types/matter";

type MatterStatusTabsProps = {
  openMatters: MatterBundle[];
  closedMatters: MatterBundle[];
};

export default function MatterStatusTabs({
  openMatters,
  closedMatters,
}: MatterStatusTabsProps) {
  const [selected, setSelected] = useState<"open" | "closed">("open");
  const matters = selected === "open" ? openMatters : closedMatters;

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Matters</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            Your legal workspace
          </h2>
        </div>

        <div className="flex w-fit rounded-md border border-[#dcdcd6] bg-[#e8e7e2] p-1" role="tablist">
          {[
            { key: "open" as const, label: "Open Matters", count: openMatters.length },
            { key: "closed" as const, label: "Closed Matters", count: closedMatters.length },
          ].map((tab) => {
            const active = selected === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelected(tab.key)}
                className={
                  "rounded-md px-3 py-2 text-sm font-semibold transition " +
                  (active
                    ? "bg-[#fffefa] text-[#20252d] shadow-sm"
                    : "text-[#777c82] hover:text-[#20252d]")
                }
              >
                {tab.label} <span className="ml-1 text-xs text-slate-400">{tab.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {matters.length > 0 ? (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {matters.map((matterData) => (
            <MatterCard
              key={matterData.matter.matter_id}
              matterData={matterData}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <p className="text-sm font-semibold text-slate-800">
            No {selected} matters yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Matters will appear here as the portfolio changes.
          </p>
        </div>
      )}
    </section>
  );
}
