"use client";

import { useState } from "react";
import { Card, StatTile } from "@/components/admin/ui";
import { fmt, reportRanges } from "@/lib/admin/data";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const [rangeId, setRangeId] = useState<(typeof reportRanges)[number]["id"]>("week");
  const [exported, setExported] = useState(false);
  const range = reportRanges.find((r) => r.id === rangeId) ?? reportRanges[0];

  const catMax = Math.max(...range.byCat.map((c) => c.value));
  const splitTotal = range.shopRevenue + range.schoolIncome;
  const shopPct = Math.round((range.shopRevenue / splitTotal) * 100);
  const schoolPct = 100 - shopPct;

  const stats = [
    { label: "Shop revenue", value: fmt(range.shopRevenue), note: `${range.orderCount} orders` },
    { label: "Average order", value: fmt(range.avgOrder), note: "pay at pickup + prepaid" },
    { label: "School income", value: fmt(range.schoolIncome), note: "fees received" },
  ];

  return (
    <div className="grid gap-5" style={{ animation: "kk-rise .5s both" }}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {reportRanges.map((r) => {
            const on = r.id === rangeId;
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={on}
                onClick={() => setRangeId(r.id)}
                className={cn(
                  "cursor-pointer whitespace-nowrap rounded-full border-[1.5px] px-4 py-[9px] font-sans text-[13px] font-semibold transition-colors",
                  on
                    ? "border-accent bg-accent text-[#FDFAF3]"
                    : "border-ink/20 bg-transparent text-ink hover:border-ink/40",
                )}
              >
                {r.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setExported(true)}
          className={cn(
            "ml-auto cursor-pointer rounded-full border-[1.5px] px-4 py-[9px] font-sans text-[13px] font-semibold transition-colors",
            exported
              ? "border-[#2E6B3F] text-[#2E6B3F]"
              : "border-ink/25 text-ink hover:border-accent hover:text-accent",
          )}
        >
          {exported ? "Exported ✓" : "Export CSV ↓"}
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3.5">
        {stats.map((s) => (
          <StatTile key={s.label} label={s.label} value={s.value} note={s.note} />
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[18px]">
        <Card className="p-[clamp(18px,2.8vw,24px)]">
          <h3 className="mb-5 font-serif text-[19px] font-normal">Revenue by category</h3>
          <div className="grid gap-4">
            {range.byCat.map((c) => (
              <div key={c.name} className="grid gap-[7px]">
                <div className="flex justify-between gap-3 text-[13.5px]">
                  <span className="font-semibold">{c.name}</span>
                  <span className="whitespace-nowrap text-ink/55">{fmt(c.value)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink/[0.08]">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.round((c.value / catMax) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-[clamp(18px,2.8vw,24px)]">
          <h3 className="mb-5 font-serif text-[19px] font-normal">Shop vs Bake School</h3>
          <div className="flex h-3 overflow-hidden rounded-full">
            <div style={{ width: `${shopPct}%`, background: "#C2185B" }} />
            <div style={{ width: `${schoolPct}%`, background: "#241A12" }} />
          </div>
          <div className="mt-5 grid gap-3">
            <div className="flex items-center justify-between gap-3 text-[14px]">
              <span className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-[3px]" style={{ background: "#C2185B" }} />
                Shop orders
              </span>
              <span className="text-ink/70">
                {fmt(range.shopRevenue)} · {shopPct}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[14px]">
              <span className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-[3px]" style={{ background: "#241A12" }} />
                Bake School fees
              </span>
              <span className="text-ink/70">
                {fmt(range.schoolIncome)} · {schoolPct}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
