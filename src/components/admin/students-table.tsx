"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, SearchInput, Pager } from "@/components/admin/ui";
import { FilterChips, TableSkeletonRows } from "@/components/admin/table-bits";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";
import { useGetStudentsQuery } from "@/redux/students/students-api";

const STATUS_FILTERS = [
  "all",
  "ACTIVE",
  "SUSPENDED",
  "GRADUATED",
  "WITHDRAWN",
] as const;
const CERT_FILTERS = ["all", "issued", "not issued"] as const;
const PAGE_SIZE = 10;

/** Students table — standalone (all) or scoped to a training via `trainingId`. */
export function StudentsTable({ trainingId }: { trainingId?: string }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [cert, setCert] = useState<(typeof CERT_FILTERS)[number]>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetStudentsQuery({
      page,
      limit: PAGE_SIZE,
      trainingId,
      search: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      certificateIssued:
        cert === "all" ? undefined : cert === "issued",
    });

  const rows = data?.data ?? [];
  const meta = data?.meta;
  const reset = () => setPage(1);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            reset();
          }}
          placeholder="Search students…"
        />
        <FilterChips
          options={STATUS_FILTERS}
          value={status}
          onChange={(v) => {
            setStatus(v);
            reset();
          }}
        />
        <FilterChips
          options={CERT_FILTERS}
          value={cert}
          onChange={(v) => {
            setCert(v);
            reset();
          }}
        />
        {meta ? (
          <span className="ml-auto text-[13px] text-ink/50">{meta.total} total</span>
        ) : null}
      </div>

      {isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : isLoading ? (
        <TableSkeletonRows />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No students"
          description={
            trainingId
              ? "No one has been admitted to this cohort yet."
              : "Admitted students will appear here."
          }
        />
      ) : (
        <>
          <Card
            className={cn("overflow-hidden transition-opacity", isFetching && "opacity-60")}
          >
            <div className="hidden items-center gap-4 border-b border-ink/10 px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink/50 min-[900px]:flex">
              <span className="flex-[2_1_180px]">Student</span>
              <span className="flex-[1_1_120px]">Phone</span>
              <span className="flex-none basis-24">Status</span>
              <span className="flex-none basis-28">Certificate</span>
              <span className="flex-none basis-4" />
            </div>
            {rows.map((st) => (
              <Link
                key={st.id}
                href={`/admin/students/${st.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/[0.08] px-[clamp(14px,2.5vw,24px)] py-4 no-underline hover:bg-accent/[0.05]"
              >
                <div className="min-w-[150px] flex-[2_1_180px]">
                  <div className="text-[15px] font-semibold">{st.fullName}</div>
                  <div className="mt-0.5 text-[12.5px] text-ink/55">{st.code}</div>
                </div>
                <div className="flex-[1_1_120px] text-[14px] text-ink/70">{st.phone}</div>
                <span className="flex-none basis-24">
                  <StatusBadge status={st.status} />
                </span>
                <span className="flex-none basis-28">
                  <StatusBadge
                    status={st.certificateIssued ? "ISSUED" : "NOT ISSUED"}
                    label={st.certificateIssued ? "Issued" : "Not issued"}
                  />
                </span>
                <span className="flex-none basis-4 text-ink/40">→</span>
              </Link>
            ))}
          </Card>
          {meta ? <Pager page={meta.page} pageCount={meta.totalPages} onPage={setPage} /> : null}
        </>
      )}
    </div>
  );
}
