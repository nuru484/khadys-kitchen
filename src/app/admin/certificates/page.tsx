"use client";

import { useState } from "react";
import { Card, StatusPill } from "@/components/admin/ui";
import { graduates } from "@/lib/admin/data";
import { getStatusColor } from "@/lib/status-colors";

export default function CertificatesPage() {
  const [issued, setIssued] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(graduates.map((g) => [g.id, g.issued])),
  );
  const issue = (id: string) => setIssued((prev) => ({ ...prev, [id]: true }));
  const issuedCount = graduates.filter((g) => issued[g.id]).length;

  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <div className="mb-[18px] flex items-center justify-end">
        <span className="text-[13px] text-ink/55">
          {issuedCount} of {graduates.length} issued
        </span>
      </div>

      <Card className="overflow-hidden">
        {graduates.map((g) => {
          const on = issued[g.id];
          return (
            <div
              key={g.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-ink/[0.08] px-[clamp(14px,2.5vw,24px)] py-4"
            >
              <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full bg-ink font-serif text-[14px] text-cream">
                {g.initials}
              </span>
              <div className="min-w-[150px] flex-[1_1_200px]">
                <div className="text-[15px] font-semibold">{g.name}</div>
                <div className="mt-0.5 text-[12.5px] text-ink/55">{g.cohort} · CTVET</div>
              </div>
              <StatusPill pill={getStatusColor(on ? "Issued" : "Not issued")}>
                {on ? "Issued" : "Not issued"}
              </StatusPill>
              <button
                type="button"
                onClick={() => issue(g.id)}
                className="ml-auto cursor-pointer rounded-full border-[1.5px] border-ink/25 px-4 py-[9px] text-[13px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
              >
                {on ? "Reissue" : "Issue certificate"}
              </button>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
