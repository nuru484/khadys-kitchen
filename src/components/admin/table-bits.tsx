"use client";

import { Card } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/** Rounded filter chips used above the admin tables. */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value === o;
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o)}
            className={cn(
              "min-h-9 rounded-full border-[1.5px] px-3.5 py-[7px] text-[12.5px] font-semibold capitalize transition-colors",
              on
                ? "border-accent bg-accent text-[#FDFAF3]"
                : "border-ink/20 text-ink/70 hover:border-ink/40",
            )}
          >
            {o === "all" ? "All" : o.toLowerCase()}
          </button>
        );
      })}
    </div>
  );
}

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
