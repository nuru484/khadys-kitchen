"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdmin } from "@/lib/admin/store";
import { Card, StatusPill } from "@/components/admin/ui";
import { appStatusPill, initials, type AppStatus } from "@/lib/admin/data";
import { cn } from "@/lib/utils";

const ACTIONS: { label: string; target: AppStatus; color: string }[] = [
  { label: "Approve", target: "Approved", color: "#2E6B3F" },
  { label: "Waitlist", target: "Waitlist", color: "#8A5F14" },
  { label: "Reject", target: "Rejected", color: "#A32036" },
];

const FEES = [
  { label: "Registration & school fees", value: "GHS 2,000" },
  { label: "Hostel (if requested)", value: "GHS 700" },
  { label: "Uniform · 2 tees + apron", value: "GHS 250" },
];

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getApplication, setAppStatus } = useAdmin();
  const app = getApplication(id);

  if (!app) {
    return (
      <div style={{ animation: "kk-rise .5s both" }}>
        <p className="text-[15px] text-ink/60">This application no longer exists.</p>
        <Link href="/admin/applications" className="mt-3 inline-block font-semibold text-accent">
          ← All applications
        </Link>
      </div>
    );
  }

  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <Link
        href="/admin/applications"
        className="mb-5 inline-block text-[13.5px] font-semibold uppercase tracking-[0.08em] text-ink/65 no-underline transition-colors hover:text-accent"
      >
        ← All applications
      </Link>

      <div className="mb-[22px] flex flex-wrap items-center gap-x-5 gap-y-3.5">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-ink font-serif text-[20px] text-cream">
          {initials(app.name)}
        </span>
        <div className="flex-[1_1_200px]">
          <h2 className="font-serif text-[clamp(24px,3vw,32px)] font-normal">{app.name}</h2>
          <div className="mt-[3px] text-[13.5px] text-ink/60">
            Applied {app.date} · {app.location}
          </div>
        </div>
        <StatusPill pill={appStatusPill(app.status)} className="px-4 py-[7px] text-[12px]">
          {app.status}
        </StatusPill>
      </div>

      <div className="mb-[26px] flex flex-wrap gap-2.5">
        {ACTIONS.map((act) => {
          const on = app.status === act.target;
          return (
            <button
              key={act.label}
              type="button"
              onClick={() => setAppStatus(app.id, act.target)}
              className="min-h-11 cursor-pointer whitespace-nowrap rounded-full border-[1.5px] px-[22px] py-[11px] font-sans text-[13.5px] font-semibold transition-colors"
              style={
                on
                  ? { borderColor: act.color, background: act.color, color: "#FDFAF3" }
                  : { borderColor: "rgba(36,26,18,0.22)", background: "transparent", color: "#241A12" }
              }
            >
              {act.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[18px]">
        <Card className="p-[clamp(20px,3vw,28px)]">
          <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
            Contact &amp; details
          </h3>
          <div className="grid gap-3.5 text-[14.5px]">
            {[
              ["Phone / WhatsApp", app.phone],
              ["Email", app.email],
              ["Location", app.location],
              ["Hostel place requested", app.hostel ? "Yes — needs a place" : "No"],
              ["Programme", "Bake School · 2-month intake"],
            ].map(([label, value], i, arr) => (
              <div
                key={label}
                className={cn(
                  "flex justify-between gap-3.5",
                  i < arr.length - 1 && "border-b border-ink/[0.08] pb-3",
                )}
              >
                <span className="text-ink/55">{label}</span>
                <span className="text-right font-semibold [overflow-wrap:anywhere]">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid content-start gap-[18px]">
          <Card className="p-[clamp(20px,3vw,28px)]">
            <h3 className="mb-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
              Applicant&rsquo;s message
            </h3>
            <p className="text-[15px] leading-[1.7] text-ink/[0.78]">{app.message}</p>
          </Card>
          <div className="rounded-[18px] border border-ink/10 bg-oat p-[clamp(18px,2.5vw,24px)]">
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/55">
              Fees checklist
            </h3>
            <div className="grid gap-[9px] text-[14px]">
              {FEES.map((f) => (
                <div key={f.label} className="flex justify-between gap-3">
                  <span>{f.label}</span>
                  <span className="font-semibold">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
