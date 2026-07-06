"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Pager, StatusPill } from "@/components/admin/ui";
import { customers, fmt } from "@/lib/admin/data";
import { getStatusColor } from "@/lib/status-colors";

const PAGE_SIZE = 6;

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(customers.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = customers.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <div className="mb-[18px] flex items-center justify-end">
        <span className="text-[13px] text-ink/55">{customers.length} customers</span>
      </div>

      <Card className="overflow-hidden">
        <div className="hidden items-center gap-4 border-b border-ink/10 px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink/50 min-[1000px]:flex">
          <span className="flex-[2_1_180px]">Customer</span>
          <span className="flex-[1_1_130px]">Phone</span>
          <span className="flex-none basis-[64px]">Orders</span>
          <span className="flex-none basis-[112px]">Payments</span>
          <span className="flex-none basis-[100px] text-right">Total spend</span>
        </div>
        {rows.map((c) => (
          <Link
            key={c.slug}
            href={`/admin/customers/${c.slug}`}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/[0.08] px-[clamp(14px,2.5vw,24px)] py-4 no-underline transition-colors hover:bg-accent/[0.05]"
          >
            <div className="flex min-w-[170px] flex-[2_1_180px] items-center gap-3">
              <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full bg-ink font-serif text-[14px] text-cream">
                {c.initials}
              </span>
              <span className="text-[15px] font-semibold">{c.name}</span>
            </div>
            <span className="flex-[1_1_130px] text-[13.5px] text-ink/75">{c.phone}</span>
            <span className="flex-none basis-[64px] text-[13.5px] text-ink/75">
              {c.orderCount}
            </span>
            <span className="flex-none basis-[112px]">
              <StatusPill pill={getStatusColor(c.unpaidCount === 0 ? "Paid" : "Unpaid")}>
                {c.unpaidCount === 0 ? "All paid" : `${c.unpaidCount} unpaid`}
              </StatusPill>
            </span>
            <span className="flex-none basis-[100px] text-right font-serif text-[15px]">
              {fmt(c.totalSpend)}
            </span>
          </Link>
        ))}
      </Card>

      <Pager page={current} pageCount={pageCount} onPage={setPage} />
    </div>
  );
}
