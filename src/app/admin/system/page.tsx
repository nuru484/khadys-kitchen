"use client";

import { useAdmin } from "@/lib/admin/store";
import { ToggleSwitch } from "@/components/admin/ui";

const labelClass =
  "grid gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-ink/60";
const fieldClass =
  "w-full rounded-[12px] border border-ink/20 bg-cream px-4 py-[13px] font-sans text-[15.5px] text-ink outline-none transition-colors focus:border-accent";
const numberClass =
  "w-[84px] rounded-[12px] border border-ink/20 bg-cream px-3.5 py-[11px] font-sans text-[15.5px] text-ink outline-none transition-colors focus:border-accent";

const NOTIFS: { key: "notifApp" | "notifOrder" | "notifDaily"; label: string; note: string }[] = [
  { key: "notifApp", label: "New application received", note: "WhatsApp + email when a student applies." },
  { key: "notifOrder", label: "New custom order placed", note: "Instant alert with need-by date and wait preference." },
  { key: "notifDaily", label: "Daily baking summary", note: "Each evening — tomorrow's queue at a glance." },
];

export default function SystemPage() {
  const { settings, toggleSetting, setSetting } = useAdmin();

  return (
    <div className="grid max-w-[680px] gap-[18px]" style={{ animation: "kk-rise .5s both" }}>
      {/* Bakery info */}
      <div className="grid gap-[18px] rounded-[18px] border border-ink/10 bg-card p-[clamp(22px,3.5vw,32px)]">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
          Bakery information
        </h3>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[18px]">
          <label className={labelClass}>
            Bakery name
            <input defaultValue="Khady's Kitchen" className={fieldClass} />
          </label>
          <label className={labelClass}>
            Location
            <input defaultValue="Kumasi, Ghana" className={fieldClass} />
          </label>
          <label className={labelClass}>
            Order WhatsApp line
            <input defaultValue="+233 24 000 0000" className={fieldClass} />
          </label>
        </div>
      </div>

      {/* Ordering rules */}
      <div className="grid gap-1 rounded-[18px] border border-ink/10 bg-card p-[clamp(22px,3.5vw,32px)]">
        <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
          Ordering rules
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-b border-ink/[0.08] py-3.5">
          <div>
            <div className="text-[14.5px] font-semibold">Accepting custom orders</div>
            <div className="mt-0.5 text-[12.5px] text-ink/55">
              Turn off to pause the shop during busy weeks.
            </div>
          </div>
          <ToggleSwitch on={settings.accepting} onToggle={() => toggleSetting("accepting")} label="Toggle accepting orders" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-b border-ink/[0.08] py-3.5">
          <div className="flex-[1_1_220px]">
            <div className="text-[14.5px] font-semibold">Minimum lead time — cakes</div>
            <div className="mt-0.5 text-[12.5px] text-ink/55">
              Days of notice required for made-to-order cakes.
            </div>
          </div>
          <input
            type="number"
            min={1}
            max={14}
            value={settings.leadDays}
            onChange={(e) => setSetting("leadDays", Number(e.target.value))}
            className={numberClass}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 py-3.5">
          <div className="flex-[1_1_220px]">
            <div className="text-[14.5px] font-semibold">Max custom orders per day</div>
            <div className="mt-0.5 text-[12.5px] text-ink/55">
              The queue closes automatically once full.
            </div>
          </div>
          <input
            type="number"
            min={1}
            max={60}
            value={settings.maxOrders}
            onChange={(e) => setSetting("maxOrders", Number(e.target.value))}
            className={numberClass}
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="grid gap-1 rounded-[18px] border border-ink/10 bg-card p-[clamp(22px,3.5vw,32px)]">
        <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
          Notifications
        </h3>
        {NOTIFS.map((n) => (
          <div
            key={n.key}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-b border-ink/[0.08] py-3.5 last:border-b-0"
          >
            <div>
              <div className="text-[14.5px] font-semibold">{n.label}</div>
              <div className="mt-0.5 text-[12.5px] text-ink/55">{n.note}</div>
            </div>
            <ToggleSwitch on={settings[n.key]} onToggle={() => toggleSetting(n.key)} label={n.label} />
          </div>
        ))}
      </div>

      {/* Maintenance */}
      <div className="rounded-[18px] border border-danger/25 bg-danger/[0.05] p-[clamp(22px,3.5vw,32px)]">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div>
            <h3 className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-danger">
              Maintenance mode
            </h3>
            <p className="max-w-[46ch] text-[14px] leading-[1.6] text-ink/65">
              Takes the public site offline and shows a &ldquo;back soon&rdquo; page.
              Orders and applications pause.
            </p>
          </div>
          <ToggleSwitch on={settings.maintenance} onToggle={() => toggleSetting("maintenance")} label="Toggle maintenance mode" />
        </div>
      </div>
    </div>
  );
}
