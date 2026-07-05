"use client";

import Link from "next/link";
import { useAdmin } from "@/lib/admin/store";
import { StatusPill } from "@/components/admin/ui";
import { cohorts } from "@/lib/admin/data";

export default function ClassesPage() {
  const { applications } = useAdmin();
  const approved = applications.filter((a) => a.status === "Approved").length;

  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[18px]">
        {cohorts.map((co) => {
          const isLive = co.status === "Enrolling";
          const admittedN = co.admittedCount ?? approved;
          const applicantsN = co.applicantsCount ?? applications.length;
          return (
            <Link
              key={co.id}
              href={`/admin/classes/${co.id}`}
              className="group flex flex-col gap-3.5 rounded-[20px] border border-ink/10 bg-card p-[clamp(22px,3vw,30px)] no-underline transition-[transform,border-color] hover:-translate-y-[3px] hover:border-accent/50"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-[54px] w-[54px] place-items-center rounded-full border-[1.5px] border-ink/20 font-serif text-[20px]">
                  {co.numeral}
                </span>
                <StatusPill
                  pill={
                    isLive
                      ? { bg: "rgba(194,24,91,0.12)", color: "#C2185B" }
                      : { bg: "rgba(46,107,63,0.12)", color: "#2E6B3F" }
                  }
                  className="px-3.5 py-1.5"
                >
                  {co.status}
                </StatusPill>
              </div>
              <div>
                <h3 className="font-serif text-[24px] font-normal">{co.name}</h3>
                <div className="mt-1 text-[13.5px] text-ink/55">{co.dates}</div>
              </div>
              <p className="flex-1 text-[14px] leading-[1.6] text-ink/[0.68]">{co.desc}</p>
              <div className="flex gap-6 border-t border-ink/10 pt-3.5">
                <div>
                  <div className="font-serif text-[22px]">{applicantsN}</div>
                  <div className="mt-0.5 text-[11.5px] uppercase tracking-[0.08em] text-ink/50">
                    Applications
                  </div>
                </div>
                <div>
                  <div className="font-serif text-[22px]">{admittedN}</div>
                  <div className="mt-0.5 text-[11.5px] uppercase tracking-[0.08em] text-ink/50">
                    Admitted
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
