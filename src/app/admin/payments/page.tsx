"use client";

import Link from "next/link";
import { useAdmin } from "@/lib/admin/store";
import { Card, StatTile } from "@/components/admin/ui";
import { fmt, isOrderPaid, orderMethod, orderTotal, type Order } from "@/lib/admin/data";

const sum = (list: Order[]) => list.reduce((s, o) => s + orderTotal(o), 0);

/** Payment-method chip: Paystack reads as neutral/dark, MoMo as accent. */
function MethodChip({ method }: { method: "Paystack" | "MoMo" }) {
  const paystack = method === "Paystack";
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-3 py-[5px] text-[11.5px] font-semibold uppercase tracking-[0.06em]"
      style={
        paystack
          ? { background: "rgba(36,26,18,0.08)", color: "#241A12" }
          : { background: "rgba(194,24,91,0.1)", color: "#C2185B" }
      }
    >
      {method}
    </span>
  );
}

export default function PaymentsPage() {
  const { orders, getItem } = useAdmin();
  const received = orders.filter((o) => isOrderPaid(o.id));
  const outstanding = orders.filter((o) => !isOrderPaid(o.id));
  const paystack = received.filter((o) => orderMethod(o.id) === "Paystack");
  const momo = received.filter((o) => orderMethod(o.id) === "MoMo");

  const stats = [
    { label: "Collected", value: fmt(sum(received)), note: `${received.length} payments` },
    { label: "Via Paystack", value: fmt(sum(paystack)), note: `${paystack.length} payments · settles T+1` },
    { label: "Via MoMo", value: fmt(sum(momo)), note: `${momo.length} payments` },
    { label: "Outstanding", value: fmt(sum(outstanding)), note: `${outstanding.length} orders · pay at pickup` },
  ];

  return (
    <div className="grid gap-5" style={{ animation: "kk-rise .5s both" }}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3.5">
        {stats.map((s) => (
          <StatTile key={s.label} label={s.label} value={s.value} note={s.note} />
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-baseline justify-between gap-3 border-b border-ink/10 px-6 py-[18px]">
          <h3 className="font-serif text-[19px] font-normal">Payments received</h3>
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-accent">
            Paystack + MoMo
          </span>
        </div>
        {received.map((o) => {
          const item = getItem(o.itemId);
          const method = orderMethod(o.id);
          return (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id.slice(1)}`}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/[0.08] px-[clamp(14px,2.5vw,24px)] py-[13px] no-underline transition-colors hover:bg-accent/[0.05]"
            >
              <span className="flex-none basis-[64px] text-[14px] font-semibold text-accent">
                {o.id}
              </span>
              <span className="flex-[1.6_1_180px] text-[14px]">
                <span className="font-semibold">{o.customer}</span>
                <span className="text-ink/55"> · {item?.name}</span>
              </span>
              <span className="flex-none basis-[112px]">
                {method ? <MethodChip method={method} /> : null}
              </span>
              <span className="ml-auto font-serif text-[15px]">{fmt(orderTotal(o))}</span>
            </Link>
          );
        })}
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-ink/10 px-6 py-[18px]">
          <h3 className="font-serif text-[19px] font-normal">
            Outstanding - collect at pickup
          </h3>
        </div>
        {outstanding.map((o) => {
          const item = getItem(o.itemId);
          return (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id.slice(1)}`}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/[0.08] px-[clamp(14px,2.5vw,24px)] py-[13px] no-underline transition-colors hover:bg-accent/[0.05]"
            >
              <span className="flex-none basis-[64px] text-[14px] font-semibold text-accent">
                {o.id}
              </span>
              <span className="flex-[1.6_1_180px] text-[14px]">
                <span className="font-semibold">{o.customer}</span>
                <span className="text-ink/55"> · {item?.name} · due {o.needBy}</span>
              </span>
              <span className="ml-auto font-serif text-[15px] text-[#8A5F14]">
                {fmt(orderTotal(o))}
              </span>
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
