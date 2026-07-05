"use client";

import Image from "next/image";
import Link from "next/link";
import { useAdmin } from "@/lib/admin/store";
import { Card, StatusPill } from "@/components/admin/ui";
import {
  activity,
  bestSellers,
  chats,
  fmt,
  orderPill,
  weekSales,
  weekTotal,
} from "@/lib/admin/data";

const MAX_BAR = Math.max(...weekSales.map((d) => d.value));
const MAX_SELLER = Math.max(...bestSellers.map((d) => d.value));

export default function DashboardPage() {
  const { orders, applications, getItem } = useAdmin();

  const open = orders.filter((o) => o.status !== "Collected");
  const orderValue = open.reduce((sum, o) => {
    const it = getItem(o.itemId);
    return it ? sum + o.qty * it.price : sum;
  }, 0);
  const newApps = applications.filter((a) => a.status === "New").length;
  const enrolled = applications.filter((a) => a.status === "Approved").length;

  const stats = [
    { label: "Open orders", value: String(open.length), note: "3 due in the next 48h", href: "/admin/items" },
    { label: "Order value", value: fmt(orderValue), note: "collected at pickup", href: "/admin/items" },
    { label: "New applications", value: String(newApps), note: "awaiting review", href: "/admin/applications" },
    { label: "Students enrolled", value: String(enrolled), note: "of 12 hostel places", href: "/admin/applications" },
  ];

  const dueSoon = orders.filter(
    (o) => (o.needBy === "06 Jul" || o.needBy === "07 Jul") && o.status !== "Collected",
  );

  return (
    <div className="grid gap-5" style={{ animation: "kk-rise .5s both" }}>
      {/* Stats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3.5">
        {stats.map((st) => (
          <Link
            key={st.label}
            href={st.href}
            className="block rounded-[18px] border border-ink/10 bg-card px-[22px] py-5 no-underline transition-colors hover:border-accent/50"
          >
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink/50">
              {st.label}
            </div>
            <div className="mt-2 font-serif text-[clamp(26px,3vw,34px)]">{st.value}</div>
            <div className="mt-1 text-[12.5px] font-semibold text-accent">{st.note}</div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[18px]">
        <Card className="p-[clamp(18px,2.8vw,24px)]">
          <div className="mb-5 flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-[19px] font-normal">Sales · this week</h3>
            <span className="whitespace-nowrap font-serif text-[18px]">{weekTotal}</span>
          </div>
          <div className="flex h-[168px] items-end gap-2.5">
            {weekSales.map((d, i) => (
              <div
                key={d.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
              >
                <span className="text-[11.5px] font-semibold text-ink/55">
                  {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
                </span>
                <div
                  className="w-full max-w-[38px] rounded-t-lg rounded-b-[3px]"
                  style={{
                    height: `${Math.max(8, Math.round((d.value / MAX_BAR) * 128))}px`,
                    background: i === 5 ? "var(--color-accent)" : "rgba(36,26,18,0.18)",
                  }}
                />
                <span className="text-[11.5px] uppercase tracking-[0.06em] text-ink/50">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-[clamp(18px,2.8vw,24px)]">
          <h3 className="mb-5 font-serif text-[19px] font-normal">Best sellers · this week</h3>
          <div className="grid gap-4">
            {bestSellers.map((b) => (
              <div key={b.name} className="grid gap-[7px]">
                <div className="flex justify-between gap-3 text-[13.5px]">
                  <span className="font-semibold">{b.name}</span>
                  <span className="whitespace-nowrap text-ink/55">{fmt(b.value)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink/[0.08]">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.round((b.value / MAX_SELLER) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Due soon */}
      <Card className="overflow-hidden">
        <div className="flex items-baseline justify-between gap-3 border-b border-ink/10 px-6 py-[18px]">
          <h3 className="font-serif text-[19px] font-normal">
            In the oven next — due within 48h
          </h3>
          <Link
            href="/admin/items"
            className="whitespace-nowrap text-[13px] font-semibold text-accent no-underline hover:underline"
          >
            All items →
          </Link>
        </div>
        {dueSoon.map((o) => {
          const it = getItem(o.itemId);
          return (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id.slice(1)}`}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/[0.08] px-[clamp(14px,2.5vw,24px)] py-[13px] no-underline transition-colors hover:bg-accent/[0.05]"
            >
              {it ? (
                <Image
                  src={it.img}
                  alt={it.name}
                  width={44}
                  height={44}
                  unoptimized
                  className="h-11 w-11 flex-none rounded-[10px] object-cover"
                />
              ) : null}
              <div className="flex-[2_1_170px] min-w-[140px]">
                <div className="text-[14.5px] font-semibold">
                  {it?.name} <span className="font-normal text-ink/50">×{o.qty}</span>
                </div>
                <div className="mt-0.5 text-[12.5px] text-ink/55">
                  {o.customer} · {o.id}
                </div>
              </div>
              <span className="flex-none basis-[76px] text-[13.5px] font-semibold">
                {o.needBy}
              </span>
              <span className="flex-none basis-24">
                <StatusPill pill={orderPill(o.status)}>{o.status}</StatusPill>
              </span>
              <span className="flex-none basis-4 text-ink/40">→</span>
            </Link>
          );
        })}
      </Card>

      {/* Activity + Chats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[18px]">
        <Card className="p-[clamp(18px,2.8vw,24px)]">
          <h3 className="mb-4 font-serif text-[19px] font-normal">Recent activity</h3>
          <div className="grid">
            {activity.map((ev, i) => (
              <Link
                key={i}
                href={ev.href}
                className="flex items-start gap-3.5 border-b border-ink/[0.07] py-[11px] no-underline transition-opacity hover:opacity-75"
              >
                <span
                  className="mt-1.5 h-[9px] w-[9px] flex-none rounded-full"
                  style={{ background: ev.dot }}
                />
                <span className="flex-1 text-[14px] leading-[1.5] text-ink/[0.82]">
                  {ev.text}
                </span>
                <span className="mt-0.5 whitespace-nowrap text-[12px] text-ink/45">
                  {ev.time}
                </span>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-[clamp(18px,2.8vw,24px)]">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-[19px] font-normal">Customer chats</h3>
            <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-accent">
              WhatsApp line
            </span>
          </div>
          <div className="grid">
            {chats.map((c) => (
              <div
                key={c.name}
                className="flex cursor-pointer items-center gap-3.5 border-b border-ink/[0.07] py-[11px] transition-opacity hover:opacity-75"
              >
                <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full bg-ink font-serif text-[14px] text-cream">
                  {c.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2.5">
                    <span className="text-[14.5px] font-semibold">{c.name}</span>
                    <span className="whitespace-nowrap text-[12px] text-ink/45">{c.time}</span>
                  </div>
                  <div className="mt-0.5 truncate text-[13.5px] text-ink/60">
                    {c.snippet}
                  </div>
                </div>
                {c.unread ? (
                  <span className="h-2.5 w-2.5 flex-none rounded-full bg-accent" />
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
