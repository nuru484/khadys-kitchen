import { Card } from "@/components/admin/ui";
import { auditLog, auditNote } from "@/lib/admin/data";

export default function AuditPage() {
  return (
    <div className="mx-auto max-w-[840px]" style={{ animation: "kk-rise .5s both" }}>
      <Card className="overflow-hidden">
        {auditLog.map((e, i) => (
          <div
            key={i}
            className="flex flex-col gap-1.5 border-b border-ink/[0.08] px-[clamp(16px,3vw,26px)] py-[15px] sm:flex-row sm:items-baseline sm:gap-5"
          >
            <span className="flex-none text-[12.5px] font-semibold text-ink/50 sm:basis-[118px]">
              {e.time}
            </span>
            <span className="flex-1 text-[14px] leading-[1.5] text-ink/[0.85]">
              <span className="font-semibold text-ink">{e.actor}</span> - {e.action}
            </span>
            <span
              className="flex-none self-start rounded-full px-3 py-[4px] text-[11px] font-semibold uppercase tracking-[0.06em]"
              style={{ background: "rgba(36,26,18,0.07)", color: "rgba(36,26,18,0.65)" }}
            >
              {e.tag}
            </span>
          </div>
        ))}
      </Card>
      <p className="mt-4 text-[13px] text-ink/55">{auditNote}</p>
    </div>
  );
}
