"use client";

import { Card } from "@/components/admin/ui";

/** Pulsing placeholder rows inside a Card while a table loads. */
export function TableSkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <Card className="overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-ink/[0.08] px-6 py-4"
        >
          <div className="h-9 flex-[2_1_180px] animate-pulse rounded bg-ink/[0.06]" />
          <div className="h-4 flex-[1_1_120px] animate-pulse rounded bg-ink/[0.06]" />
          <div className="h-5 basis-24 animate-pulse rounded-full bg-ink/[0.06]" />
        </div>
      ))}
    </Card>
  );
}
