"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdmin } from "@/lib/admin/store";
import { Card, StatTile, StatusPill } from "@/components/admin/ui";
import {
  fmt,
  getCustomer,
  isOrderPaid,
  orderMethod,
  orderPill,
  orderTotal,
  paymentPill,
} from "@/lib/admin/data";

export default function CustomerDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { orders, getItem } = useAdmin();
  const customer = getCustomer(slug);

  if (!customer) {
    return (
      <div style={{ animation: "kk-rise .5s both" }}>
        <p className="text-[15px] text-ink/60">This customer no longer exists.</p>
        <Link href="/admin/customers" className="mt-3 inline-block font-semibold text-accent">
          ← All customers
        </Link>
      </div>
    );
  }

  const history = orders.filter((o) => customer.orderIds.includes(o.id));
  const outstanding = history
    .filter((o) => !isOrderPaid(o.id))
    .reduce((sum, o) => sum + orderTotal(o), 0);
  const waHref = `https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}`;

  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <Link
        href="/admin/customers"
        className="mb-5 inline-block text-[13.5px] font-semibold uppercase tracking-[0.08em] text-ink/65 no-underline transition-colors hover:text-accent"
      >
        ← All customers
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-3.5">
        <span className="grid h-[54px] w-[54px] flex-none place-items-center rounded-full bg-ink font-serif text-[18px] text-cream">
          {customer.initials}
        </span>
        <div className="flex-[1_1_240px]">
          <h2 className="font-serif text-[clamp(24px,3vw,32px)] font-normal">
            {customer.name}
          </h2>
          <div className="mt-[3px] text-[13.5px] text-ink/60">
            {customer.phone} · {customer.email}
          </div>
        </div>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-accent px-5 py-3 text-[13.5px] font-semibold text-[#FDFAF3] no-underline transition-colors hover:bg-ink"
        >
          Message on WhatsApp
        </a>
      </div>

      <div className="mb-[26px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-3.5">
        <StatTile label="Orders" value={String(customer.orderCount)} />
        <StatTile label="Total spend" value={fmt(customer.totalSpend)} />
        <StatTile label="Outstanding" value={fmt(outstanding)} />
      </div>

      <h3 className="mb-3 font-serif text-[19px] font-normal">Order history</h3>
      <Card className="overflow-hidden">
        {history.map((o) => {
          const item = getItem(o.itemId);
          const paid = isOrderPaid(o.id);
          return (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id.slice(1)}`}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/[0.08] px-[clamp(14px,2.5vw,24px)] py-[14px] no-underline transition-colors hover:bg-accent/[0.05]"
            >
              <span className="flex-none basis-[64px] text-[14px] font-semibold text-accent">
                {o.id}
              </span>
              <span className="flex-[1.4_1_160px] text-[14px] font-semibold">
                {item?.name} <span className="font-normal text-ink/50">×{o.qty}</span>
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
              <span className="ml-auto font-serif text-[15px]">{fmt(orderTotal(o))}</span>
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
