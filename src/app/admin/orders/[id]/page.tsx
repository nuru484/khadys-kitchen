"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdmin } from "@/lib/admin/store";
import { Card, StatusPill } from "@/components/admin/ui";
import { fmt, initials, orderPill, type OrderStatus } from "@/lib/admin/data";

const STATUSES: OrderStatus[] = ["Pending", "Confirmed", "Ready", "Collected"];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrder, getItem, setOrderStatus } = useAdmin();
  const order = getOrder(id);
  const item = order ? getItem(order.itemId) : undefined;

  if (!order) {
    return (
      <div style={{ animation: "kk-rise .5s both" }}>
        <p className="text-[15px] text-ink/60">This order no longer exists.</p>
        <Link href="/admin/items" className="mt-3 inline-block font-semibold text-accent">
          ← Shop items
        </Link>
      </div>
    );
  }

  const itemHref = item ? `/admin/items/${item.id}` : "/admin/items";
  const total = item ? order.qty * item.price : 0;

  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <Link
        href={itemHref}
        className="mb-5 inline-block text-[13.5px] font-semibold uppercase tracking-[0.08em] text-ink/65 no-underline transition-colors hover:text-accent"
      >
        ← Back to item
      </Link>

      <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3.5">
        <div className="flex-[1_1_220px]">
          <h2 className="font-serif text-[clamp(24px,3vw,32px)] font-normal">Order {order.id}</h2>
          <div className="mt-[3px] text-[13.5px] text-ink/60">
            Placed {order.placed} · needed by {order.needBy}
          </div>
        </div>
        <StatusPill pill={orderPill(order.status)} className="px-4 py-[7px] text-[12px]">
          {order.status}
        </StatusPill>
      </div>

      <div className="mb-[26px] flex flex-wrap items-center gap-2.5">
        <span className="mr-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink/50">
          Set status
        </span>
        {STATUSES.map((target) => {
          const on = order.status === target;
          const pill = orderPill(target);
          return (
            <button
              key={target}
              type="button"
              onClick={() => setOrderStatus(order.id, target)}
              className="min-h-11 cursor-pointer whitespace-nowrap rounded-full border-[1.5px] px-[22px] py-[11px] font-sans text-[13.5px] font-semibold transition-colors"
              style={
                on
                  ? { borderColor: pill.color, background: pill.color, color: "#FDFAF3" }
                  : { borderColor: "rgba(36,26,18,0.22)", background: "transparent", color: "#241A12" }
              }
            >
              {target}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[18px]">
        <Card className="p-[clamp(20px,3vw,28px)]">
          <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
            Order summary
          </h3>
          <Link
            href={itemHref}
            className="mb-4 flex items-center gap-4 border-b border-ink/10 pb-4 no-underline text-ink transition-opacity hover:opacity-80"
          >
            {item ? (
              <Image
                src={item.img}
                alt={item.name}
                width={64}
                height={64}
                unoptimized
                className="h-16 w-16 flex-none rounded-[14px] object-cover"
              />
            ) : null}
            <div>
              <div className="font-serif text-[19px]">{item?.name}</div>
              <div className="mt-[3px] text-[13px] text-ink/55">
                {item?.unit} · {item?.lead}
              </div>
            </div>
          </Link>
          <div className="grid gap-3 text-[14.5px]">
            <div className="flex justify-between gap-3.5">
              <span className="text-ink/55">Unit price</span>
              <span className="font-semibold">{item ? fmt(item.price) : "—"}</span>
            </div>
            <div className="flex justify-between gap-3.5">
              <span className="text-ink/55">Quantity</span>
              <span className="font-semibold">×{order.qty}</span>
            </div>
            <div className="flex justify-between gap-3.5 border-t border-ink/10 pt-3">
              <span className="font-semibold">Total · pay at pickup</span>
              <span className="font-serif text-[20px]">{fmt(total)}</span>
            </div>
          </div>
        </Card>

        <div className="grid content-start gap-[18px]">
          <Card className="p-[clamp(20px,3vw,28px)]">
            <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
              Customer
            </h3>
            <div className="mb-4 flex items-center gap-3.5">
              <span className="grid h-[46px] w-[46px] place-items-center rounded-full bg-ink font-serif text-[16px] text-cream">
                {initials(order.customer)}
              </span>
              <div>
                <div className="text-[15.5px] font-semibold">{order.customer}</div>
                <div className="mt-0.5 text-[13px] text-ink/55">{order.phone}</div>
              </div>
            </div>
            <div className="grid gap-3 text-[14.5px]">
              {[
                ["Email", order.email],
                ["Needed by", order.needBy],
                ["Wait preference", order.wait],
                ["Placed", order.placed],
              ].map(([label, value], i, arr) => (
                <div
                  key={label}
                  className={`flex justify-between gap-3.5 ${i < arr.length - 1 ? "border-b border-ink/[0.08] pb-[11px]" : ""}`}
                >
                  <span className="text-ink/55">{label}</span>
                  <span className="text-right font-semibold [overflow-wrap:anywhere]">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          {order.note ? (
            <div className="rounded-[18px] border border-ink/10 bg-oat p-[clamp(18px,2.5vw,24px)]">
              <h3 className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/55">
                Customer note
              </h3>
              <p className="text-[14.5px] leading-[1.65] text-ink/[0.78]">{order.note}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
