"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAdmin } from "@/lib/admin/store";
import { Card, Pager, SearchInput, StatusPill } from "@/components/admin/ui";
import { fmt } from "@/lib/admin/data";

const PAGE_SIZE = 6;

export default function ItemsPage() {
  const { items, orders } = useAdmin();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => !q || `${it.name} ${it.cat}`.toLowerCase().includes(q));
  }, [items, search]);

  const openOrders = (itemId: string) =>
    orders.filter((o) => o.itemId === itemId && o.status !== "Collected").length;

  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <div className="mb-[18px] flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search items…" />
        <span className="ml-auto whitespace-nowrap text-[13px] text-ink/55">
          {list.length} of {items.length}
        </span>
        <Link
          href="/admin/items/new"
          className="whitespace-nowrap rounded-full bg-accent px-6 py-3 text-[13.5px] font-semibold tracking-[0.04em] text-[#FDFAF3] no-underline transition-colors hover:bg-ink"
        >
          + Add item
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="hidden items-center gap-4 border-b border-ink/10 px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink/50 min-[1000px]:flex">
          <span className="flex-[2_1_220px]">Item</span>
          <span className="flex-none basis-[90px]">Category</span>
          <span className="flex-none basis-[90px]">Price</span>
          <span className="flex-[1_1_130px]">Lead time</span>
          <span className="flex-none basis-[70px]">Orders</span>
          <span className="flex-none basis-20">Status</span>
          <span className="flex-none basis-4" />
        </div>
        {rows.map((it) => (
          <Link
            key={it.id}
            href={`/admin/items/${it.id}`}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/[0.08] px-[clamp(14px,2.5vw,24px)] py-3.5 no-underline transition-colors hover:bg-accent/[0.05]"
          >
            <div className="flex min-w-[170px] flex-[2_1_220px] items-center gap-3.5">
              <Image
                src={it.img}
                alt={it.name}
                width={52}
                height={52}
                unoptimized
                className="h-[52px] w-[52px] flex-none rounded-[12px] object-cover"
              />
              <div>
                <div className="text-[15px] font-semibold">{it.name}</div>
                <div className="mt-0.5 text-[12.5px] text-ink/55">{it.unit}</div>
              </div>
            </div>
            <span className="flex-none basis-[90px] text-[13.5px] text-ink/75">{it.cat}</span>
            <span className="flex-none basis-[90px] text-[14px] font-semibold">{fmt(it.price)}</span>
            <span className="flex-[1_1_130px] text-[13.5px] text-ink/75">{it.lead}</span>
            <span className="flex-none basis-[70px] text-[14px] font-semibold">{openOrders(it.id)}</span>
            <span className="flex-none basis-20">
              <StatusPill pill={{ bg: "rgba(46,107,63,0.12)", color: "#2E6B3F" }}>Active</StatusPill>
            </span>
            <span className="flex-none basis-4 text-ink/40">→</span>
          </Link>
        ))}
      </Card>

      <Pager page={current} pageCount={pageCount} onPage={setPage} />
    </div>
  );
}
