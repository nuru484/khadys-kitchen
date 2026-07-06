"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/lib/admin/store";
import { Card, Pager, SearchInput, StatusPill } from "@/components/admin/ui";
import {
  fmt,
  isDelivered,
  isOrderPaid,
  orderMethod,
  orderPill,
  orderTotal,
  paymentPill,
  type OrderStatus,
} from "@/lib/admin/data";
import { cn } from "@/lib/utils";

type OrderFilter = "all" | OrderStatus | "Unpaid";

const FILTERS: { id: OrderFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Pending", label: "Pending" },
  { id: "Confirmed", label: "Confirmed" },
  { id: "Ready", label: "Ready" },
  { id: "Collected", label: "Collected" },
  { id: "Unpaid", label: "Unpaid" },
];

const PAGE_SIZE = 6;

export default function OrdersPage() {
  const { orders, getItem } = useAdmin();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [page, setPage] = useState(1);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const item = getItem(o.itemId);
      const matchesFilter =
        filter === "all" ||
        (filter === "Unpaid" ? !isOrderPaid(o.id) : o.status === filter);
      const matchesSearch =
        !q ||
        `${o.id} ${o.customer} ${item?.name ?? ""}`.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [orders, getItem, search, filter]);

  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <div className="mb-[18px] flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search orders, customers…"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setFilter(f.id);
                  setPage(1);
                }}
                className={cn(
                  "cursor-pointer whitespace-nowrap rounded-full border-[1.5px] px-4 py-[9px] font-sans text-[13px] font-semibold transition-colors",
                  on
                    ? "border-accent bg-accent text-[#FDFAF3]"
                    : "border-ink/20 bg-transparent text-ink hover:border-ink/40",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <span className="ml-auto whitespace-nowrap text-[13px] text-ink/55">
          {list.length} of {orders.length}
        </span>
      </div>

      <Card className="overflow-hidden">
        <div className="hidden items-center gap-4 border-b border-ink/10 px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink/50 min-[1000px]:flex">
          <span className="flex-[1.4_1_150px]">Order · Customer</span>
          <span className="flex-[1.3_1_150px]">Item</span>
          <span className="flex-none basis-[76px]">Need by</span>
          <span className="flex-none basis-[128px]">Payment</span>
          <span className="flex-none basis-24">Status</span>
          <span className="flex-none basis-[80px] text-right">Total</span>
        </div>
        {rows.map((o) => {
          const item = getItem(o.itemId);
          const paid = isOrderPaid(o.id);
          return (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id.slice(1)}`}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/[0.08] px-[clamp(14px,2.5vw,24px)] py-[15px] no-underline transition-colors hover:bg-accent/[0.05]"
            >
              <div className="min-w-[150px] flex-[1.4_1_150px]">
                <div className="text-[14.5px] font-semibold">
                  <span className="text-accent">{o.id}</span> · {o.customer}
                </div>
                <div
                  className={cn(
                    "mt-0.5 text-[12.5px]",
                    isDelivered(o) ? "text-[#2E6B3F]" : "text-ink/50",
                  )}
                >
                  {isDelivered(o) ? "Delivered" : "In queue"}
                </div>
              </div>
              <span className="flex-[1.3_1_150px] text-[13.5px] text-ink/75">
                {item?.name} <span className="text-ink/50">×{o.qty}</span>
              </span>
              <span className="flex-none basis-[76px] text-[13px] text-ink/60">
                {o.needBy}
              </span>
              <span className="flex-none basis-[128px]">
                <StatusPill pill={paymentPill(paid)}>
                  {paid ? `Paid · ${orderMethod(o.id)}` : "Unpaid"}
                </StatusPill>
              </span>
              <span className="flex-none basis-24">
                <StatusPill pill={orderPill(o.status)}>{o.status}</StatusPill>
              </span>
              <span className="flex-none basis-[80px] text-right font-serif text-[15px]">
                {fmt(orderTotal(o))}
              </span>
            </Link>
          );
        })}
      </Card>

      <Pager page={current} pageCount={pageCount} onPage={setPage} />
    </div>
  );
}
