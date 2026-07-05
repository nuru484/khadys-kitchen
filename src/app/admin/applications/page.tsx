"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/lib/admin/store";
import { Card, Pager, SearchInput, StatusPill } from "@/components/admin/ui";
import { appStatusPill, type AppStatus } from "@/lib/admin/data";
import { cn } from "@/lib/utils";

const FILTERS: { id: "all" | AppStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "New", label: "New" },
  { id: "Approved", label: "Approved" },
  { id: "Waitlist", label: "Waitlist" },
  { id: "Rejected", label: "Rejected" },
];

const PAGE_SIZE = 6;

export default function ApplicationsPage() {
  const { applications } = useAdmin();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | AppStatus>("all");
  const [page, setPage] = useState(1);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter(
      (a) =>
        (filter === "all" || a.status === filter) &&
        (!q || `${a.name} ${a.location} ${a.email} ${a.phone}`.toLowerCase().includes(q)),
    );
  }, [applications, search, filter]);

  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <div className="mb-[18px] flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search applicants…" />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => { setFilter(f.id); setPage(1); }}
                className={cn(
                  "cursor-pointer whitespace-nowrap rounded-full border-[1.5px] px-4 py-[9px] font-sans text-[13px] font-semibold transition-colors",
                  on ? "border-accent bg-accent text-[#FDFAF3]" : "border-ink/20 bg-transparent text-ink hover:border-ink/40",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <span className="ml-auto whitespace-nowrap text-[13px] text-ink/55">
          {list.length} of {applications.length}
        </span>
      </div>

      <Card className="overflow-hidden">
        <div className="hidden items-center gap-4 border-b border-ink/10 px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink/50 min-[1000px]:flex">
          <span className="flex-[2_1_180px]">Applicant</span>
          <span className="flex-[1_1_120px]">Phone</span>
          <span className="flex-[1_1_110px]">Location</span>
          <span className="flex-none basis-[60px]">Hostel</span>
          <span className="flex-none basis-[86px]">Applied</span>
          <span className="flex-none basis-24">Status</span>
          <span className="flex-none basis-4" />
        </div>
        {rows.map((a) => (
          <Link
            key={a.id}
            href={`/admin/applications/${a.id}`}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/[0.08] px-[clamp(14px,2.5vw,24px)] py-4 no-underline transition-colors hover:bg-accent/[0.05]"
          >
            <div className="min-w-[150px] flex-[2_1_180px]">
              <div className="text-[15px] font-semibold">{a.name}</div>
              <div className="mt-0.5 text-[12.5px] text-ink/55">{a.email}</div>
            </div>
            <span className="flex-[1_1_120px] text-[13.5px] text-ink/75">{a.phone}</span>
            <span className="flex-[1_1_110px] text-[13.5px] text-ink/75">{a.location}</span>
            <span className="flex-none basis-[60px] text-[13.5px] text-ink/75">
              {a.hostel ? "Yes" : "No"}
            </span>
            <span className="flex-none basis-[86px] text-[13px] text-ink/60">{a.date}</span>
            <span className="flex-none basis-24">
              <StatusPill pill={appStatusPill(a.status)}>{a.status}</StatusPill>
            </span>
            <span className="flex-none basis-4 text-ink/40">→</span>
          </Link>
        ))}
      </Card>

      <Pager page={current} pageCount={pageCount} onPage={setPage} />
    </div>
  );
}
