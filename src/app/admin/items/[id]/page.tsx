"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdmin } from "@/lib/admin/store";
import { Card, StatusPill } from "@/components/admin/ui";
import { fmt, orderPill } from "@/lib/admin/data";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getItem, orders } = useAdmin();
  const item = getItem(id);

  if (!item) {
    return (
      <div style={{ animation: "kk-rise .5s both" }}>
        <p className="text-[15px] text-ink/60">This item no longer exists.</p>
        <Link href="/admin/items" className="mt-3 inline-block font-semibold text-accent">
          ← All items
        </Link>
      </div>
    );
  }

  const itemOrders = orders.filter((o) => o.itemId === item.id);
  const openCount = itemOrders.filter((o) => o.status !== "Collected").length;
  const revenue = itemOrders.reduce((sum, o) => sum + o.qty * item.price, 0);

  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/items"
          className="text-[13.5px] font-semibold uppercase tracking-[0.08em] text-ink/65 no-underline transition-colors hover:text-accent"
        >
          ← All items
        </Link>
        <Link
          href={`/admin/items/${item.id}/edit`}
          className="whitespace-nowrap rounded-full border-[1.5px] border-ink/25 bg-transparent px-[22px] py-2.5 text-[13.5px] font-semibold text-ink no-underline transition-colors hover:border-accent hover:text-accent"
        >
          Edit item ✎
        </Link>
      </div>

      <div className="mb-[22px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[18px]">
        <Card className="overflow-hidden">
          <div className="relative h-[220px] w-full">
            <Image src={item.img} alt={item.name} fill unoptimized sizes="(max-width:700px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="p-[clamp(20px,3vw,26px)]">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-[clamp(22px,2.8vw,28px)] font-normal">{item.name}</h2>
              <span className="whitespace-nowrap font-serif text-[20px]">{fmt(item.price)}</span>
            </div>
            <div className="mt-1 text-[13px] text-ink/55">
              {item.unit} · {item.cat} · {item.lead}
            </div>
            <p className="mt-3.5 text-[14.5px] leading-[1.65] text-ink/75">{item.desc}</p>
          </div>
        </Card>

        <div className="grid content-start gap-[18px]">
          <div className="grid grid-cols-2 gap-3.5">
            <div className="rounded-[16px] border border-ink/10 bg-card p-[18px]">
              <div className="font-serif text-[26px]">{openCount}</div>
              <div className="mt-1 text-[12px] uppercase tracking-[0.08em] text-ink/55">Open orders</div>
            </div>
            <div className="rounded-[16px] border border-ink/10 bg-card p-[18px]">
              <div className="font-serif text-[26px]">{fmt(revenue)}</div>
              <div className="mt-1 text-[12px] uppercase tracking-[0.08em] text-ink/55">Order value</div>
            </div>
          </div>
          <div className="rounded-[16px] border border-ink/10 bg-oat px-5 py-[18px] text-[14px] leading-[1.6] text-ink/70">
            Made custom to order - every order below carries the customer&rsquo;s
            need-by date and wait preference from checkout.
          </div>
        </div>
      </div>

      <h3 className="mb-3 font-serif text-[20px] font-normal">Orders for this item</h3>
      <Card className="overflow-hidden">
        <div className="hidden items-center gap-4 border-b border-ink/10 px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink/50 min-[1000px]:flex">
          <span className="flex-none basis-[74px]">Order</span>
          <span className="flex-[2_1_160px]">Customer</span>
          <span className="flex-none basis-[44px]">Qty</span>
          <span className="flex-none basis-24">Need by</span>
          <span className="flex-[1_1_150px]">Wait preference</span>
          <span className="flex-none basis-24">Status</span>
          <span className="flex-none basis-20 text-right">Total</span>
        </div>
        {itemOrders.length === 0 ? (
          <div className="px-6 py-7 text-[14.5px] text-ink/55">No open orders for this item.</div>
        ) : (
          itemOrders.map((o) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id.slice(1)}`}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/[0.08] px-[clamp(14px,2.5vw,24px)] py-[15px] no-underline transition-colors hover:bg-accent/[0.05]"
            >
              <span className="flex-none basis-[74px] text-[13px] font-semibold text-accent">{o.id}</span>
              <div className="min-w-[130px] flex-[2_1_160px]">
                <div className="text-[14.5px] font-semibold">{o.customer}</div>
                <div className="mt-0.5 text-[12.5px] text-ink/55">{o.phone}</div>
              </div>
              <span className="flex-none basis-[44px] text-[14px] font-semibold">×{o.qty}</span>
              <span className="flex-none basis-24 text-[13.5px] text-ink/75">{o.needBy}</span>
              <span className="flex-[1_1_150px] text-[13px] text-ink/60">{o.wait}</span>
              <span className="flex-none basis-24">
                <StatusPill pill={orderPill(o.status)}>{o.status}</StatusPill>
              </span>
              <span className="flex-none basis-20 text-right text-[14px] font-semibold">
                {fmt(o.qty * item.price)}
              </span>
            </Link>
          ))
        )}
      </Card>
    </div>
  );
}
