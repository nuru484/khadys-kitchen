"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdmin } from "@/lib/admin/store";
import { Card, StatusPill } from "@/components/admin/ui";
import { appStatusPill, cohorts, initials } from "@/lib/admin/data";

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { applications } = useAdmin();
  const cohort = cohorts.find((c) => c.id === id) ?? cohorts[cohorts.length - 1];
  const isLive = cohort.status === "Enrolling";

  // Graduated cohorts carry their own roster; the live cohort pulls from applications.
  const admitted =
    cohort.admitted !== null
      ? cohort.admitted.map((m) => ({ ...m, href: "/admin/classes", initials: initials(m.name) }))
      : applications
          .filter((a) => a.status === "Approved")
          .map((a) => ({
            name: a.name,
            location: a.location,
            note: a.hostel ? "Hostel place held" : "Day student",
            href: `/admin/applications/${a.id}`,
            initials: initials(a.name),
          }));

  const applicants =
    cohort.applicants !== null
      ? []
      : applications
          .filter((a) => a.status !== "Approved")
          .map((a) => ({
            name: a.name,
            location: a.location,
            status: a.status,
            href: `/admin/applications/${a.id}`,
            initials: initials(a.name),
          }));

  const admittedNote =
    cohort.admittedCount != null && cohort.admittedCount > admitted.length
      ? `Showing ${admitted.length} of ${cohort.admittedCount} graduates`
      : "";

  const pill = isLive
    ? { bg: "rgba(194,24,91,0.12)", color: "#C2185B" }
    : { bg: "rgba(46,107,63,0.12)", color: "#2E6B3F" };

  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <Link
        href="/admin/classes"
        className="mb-5 inline-block text-[13.5px] font-semibold uppercase tracking-[0.08em] text-ink/65 no-underline transition-colors hover:text-accent"
      >
        ← All cohorts
      </Link>
      <div className="mb-2 flex flex-wrap items-center gap-x-5 gap-y-3">
        <h2 className="font-serif text-[clamp(24px,3vw,32px)] font-normal">{cohort.name}</h2>
        <StatusPill pill={pill} className="px-4 py-[7px] text-[12px]">
          {cohort.status}
        </StatusPill>
      </div>
      <p className="mb-[26px] text-[14.5px] text-ink/60">
        {cohort.dates} · {cohort.desc}
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[18px]">
        <Card className="p-[clamp(18px,2.8vw,24px)]">
          <div className="mb-3.5 flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-[19px] font-normal">Admitted students</h3>
            {admittedNote ? (
              <span className="whitespace-nowrap text-[12.5px] text-ink/50">{admittedNote}</span>
            ) : null}
          </div>
          <div className="grid">
            {admitted.map((m) => (
              <Link
                key={m.name}
                href={m.href}
                className="flex items-center gap-3.5 border-b border-ink/[0.07] py-3 no-underline transition-opacity hover:opacity-75"
              >
                <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full bg-ink font-serif text-[14px] text-cream">
                  {m.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[14.5px] font-semibold">{m.name}</div>
                  <div className="mt-0.5 text-[12.5px] text-ink/55">
                    {m.location} · {m.note}
                  </div>
                </div>
                <StatusPill pill={{ bg: "rgba(46,107,63,0.12)", color: "#2E6B3F" }} className="px-3 py-[5px] text-[11px]">
                  Admitted
                </StatusPill>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-[clamp(18px,2.8vw,24px)]">
          <h3 className="mb-3.5 font-serif text-[19px] font-normal">Applications under review</h3>
          {applicants.length === 0 ? (
            <p className="text-[14.5px] text-ink/55">
              This cohort has graduated — no open applications.
            </p>
          ) : (
            <div className="grid">
              {applicants.map((ap) => (
                <Link
                  key={ap.name}
                  href={ap.href}
                  className="flex items-center gap-3.5 border-b border-ink/[0.07] py-3 no-underline transition-opacity hover:opacity-75"
                >
                  <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full bg-ink/[0.08] font-serif text-[14px]">
                    {ap.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14.5px] font-semibold">{ap.name}</div>
                    <div className="mt-0.5 text-[12.5px] text-ink/55">{ap.location}</div>
                  </div>
                  <StatusPill pill={appStatusPill(ap.status)} className="px-3 py-[5px] text-[11px]">
                    {ap.status}
                  </StatusPill>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
