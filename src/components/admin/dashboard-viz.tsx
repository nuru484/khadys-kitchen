import { cn } from "@/lib/utils";
import { Card } from "@/components/admin/ui";
import { fmt } from "@/lib/admin/data";

/** Vertical CSS bar chart of the week's sales, peak day highlighted in accent. */
export function WeekSalesChart({
  data,
  total,
}: {
  data: { day: string; value: number }[];
  total: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  const peak = data.reduce((hi, d) => (d.value > hi.value ? d : hi), data[0]);
  const summary = `Sales this week, total ${total}. Best day ${peak.day} at ${fmt(peak.value)}.`;

  return (
    <Card className="p-[clamp(18px,2.8vw,24px)]">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-[19px] font-normal">Sales · this week</h3>
        <span className="whitespace-nowrap font-serif text-[18px]">{total}</span>
      </div>
      <div
        role="img"
        aria-label={summary}
        className="flex h-[168px] items-end gap-2.5"
      >
        {data.map((d) => (
          <div
            key={d.day}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          >
            <span aria-hidden className="text-[11.5px] font-semibold text-ink/55">
              {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
            </span>
            <div
              className={cn(
                "w-full max-w-[38px] rounded-t-lg rounded-b-[3px]",
                d === peak ? "bg-accent" : "bg-ink/[0.18]",
              )}
              style={{
                height: `${Math.max(8, Math.round((d.value / max) * 128))}px`,
              }}
            />
            <span
              aria-hidden
              className="text-[11.5px] uppercase tracking-[0.06em] text-ink/50"
            >
              {d.day}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Horizontal progress meters ranking the week's best-selling items. */
export function BestSellersMeters({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <Card className="p-[clamp(18px,2.8vw,24px)]">
      <h3 className="mb-5 font-serif text-[19px] font-normal">
        Best sellers · this week
      </h3>
      <div className="grid gap-4">
        {data.map((b) => (
          <div key={b.name} className="grid gap-[7px]">
            <div className="flex justify-between gap-3 text-[13.5px]">
              <span className="font-semibold">{b.name}</span>
              <span className="whitespace-nowrap text-ink/55">{fmt(b.value)}</span>
            </div>
            <div
              role="meter"
              aria-label={`${b.name} sales`}
              aria-valuemin={0}
              aria-valuemax={max}
              aria-valuenow={b.value}
              aria-valuetext={fmt(b.value)}
              className="h-2 overflow-hidden rounded-full bg-ink/[0.08]"
            >
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${Math.round((b.value / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
