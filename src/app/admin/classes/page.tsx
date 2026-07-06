"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pager } from "@/components/admin/ui";
import { FilterBar, LabeledSelect } from "@/components/admin/filter-bar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format-date";
import { useGetTrainingsQuery } from "@/redux/trainings/trainings-api";

const STATUS_FILTERS = ["all", "DRAFT", "UPCOMING", "ONGOING", "COMPLETED"] as const;
const PAGE_SIZE = 12;

export default function ClassesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetTrainingsQuery({
      page,
      limit: PAGE_SIZE,
      search: search.trim() || undefined,
      status: status === "all" ? undefined : status,
    });

  const trainings = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <FilterBar
        search={search}
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search trainings…"
        activeCount={status !== "all" ? 1 : 0}
        action={
          <Link
            href="/admin/classes/new"
            className="inline-block rounded-full bg-accent px-4 py-2.5 text-[13px] font-semibold text-[#FDFAF3] no-underline transition-colors hover:bg-ink lg:px-5 lg:text-[13.5px]"
          >
            + New training
          </Link>
        }
      >
        <LabeledSelect
          label="Status"
          value={status}
          active={status !== "all"}
          onChange={(v) => {
            setStatus(v as (typeof STATUS_FILTERS)[number]);
            setPage(1);
          }}
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f} value={f}>
              {f === "all" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </option>
          ))}
        </LabeledSelect>
      </FilterBar>

      {isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[18px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[210px] animate-pulse rounded-[20px] bg-ink/[0.06]" />
          ))}
        </div>
      ) : trainings.length === 0 ? (
        <EmptyState
          title="No trainings yet"
          description="Create your first Bake School cohort to start taking applications."
          action={{ label: "+ New training", href: "/admin/classes/new" }}
        />
      ) : (
        <>
          <div
            className={cn(
              "grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[18px] transition-opacity",
              isFetching && "opacity-60",
            )}
          >
            {trainings.map((t) => (
              <Link
                key={t.id}
                href={`/admin/classes/${t.id}`}
                className="group flex flex-col gap-3.5 rounded-[20px] border border-ink/10 bg-card p-[clamp(22px,3vw,30px)] no-underline transition-[transform,border-color] hover:-translate-y-[3px] hover:border-accent/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-[54px] w-[54px] place-items-center rounded-full border-[1.5px] border-ink/20 font-serif text-[20px]">
                    {t.numeral ?? "—"}
                  </span>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status={t.status} />
                    <StatusBadge
                      status={t.isPublished ? "PUBLISHED" : "DRAFT"}
                      label={t.isPublished ? "Published" : "Unpublished"}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-[24px] font-normal">{t.name}</h3>
                  <div className="mt-1 text-[13.5px] text-ink/55">
                    {t.startDate ? formatDate(t.startDate) : "Dates TBC"}
                    {t.endDate ? ` – ${formatDate(t.endDate)}` : ""}
                  </div>
                </div>
                <p className="line-clamp-2 flex-1 text-[14px] leading-[1.6] text-ink/[0.68]">
                  {t.description}
                </p>
                <div className="flex gap-6 border-t border-ink/10 pt-3.5">
                  <div>
                    <div className="font-serif text-[22px]">
                      {t.counts?.applications ?? 0}
                    </div>
                    <div className="mt-0.5 text-[11.5px] uppercase tracking-[0.08em] text-ink/50">
                      Applications
                    </div>
                  </div>
                  <div>
                    <div className="font-serif text-[22px]">
                      {t.counts?.students ?? 0}
                    </div>
                    <div className="mt-0.5 text-[11.5px] uppercase tracking-[0.08em] text-ink/50">
                      Admitted
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {meta ? (
            <Pager
              page={meta.page}
              pageCount={meta.totalPages}
              onPage={setPage}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
