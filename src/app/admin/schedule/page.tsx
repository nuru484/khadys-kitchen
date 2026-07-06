import { Card } from "@/components/admin/ui";
import { scheduleDays, scheduleNote } from "@/lib/admin/data";

export default function SchedulePage() {
  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <Card className="overflow-hidden">
        {scheduleDays.map((d) => (
          <div
            key={d.day}
            className="flex flex-col gap-2 border-b border-ink/[0.08] px-[clamp(16px,3vw,26px)] py-[18px] sm:flex-row sm:gap-6"
          >
            <div className="flex-none font-serif text-[16px] sm:basis-[110px]">
              {d.day}
            </div>
            <div className="grid flex-1 gap-2.5">
              {d.events.map((e, i) => (
                <div key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="basis-[52px] text-[12.5px] font-semibold text-ink/55">
                    {e.time}
                  </span>
                  <span className="flex-1 text-[14px] text-ink/[0.85]">{e.label}</span>
                  <span
                    className="rounded-full px-3 py-[4px] text-[11px] font-semibold uppercase tracking-[0.06em]"
                    style={{ background: "rgba(194,24,91,0.1)", color: "#C2185B" }}
                  >
                    {e.kind}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Card>
      <p className="mt-4 text-[13px] text-ink/55">{scheduleNote}</p>
    </div>
  );
}
