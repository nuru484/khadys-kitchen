"use client";

import { useAdmin } from "@/lib/admin/store";
import { ToggleSwitch } from "@/components/admin/ui";

const labelClass =
  "grid gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-ink/60";
const fieldClass =
  "w-full rounded-[12px] border border-ink/20 bg-cream px-4 py-[13px] font-sans text-[15.5px] text-ink outline-none transition-colors focus:border-accent";

const SESSIONS = [
  { device: "MacBook · Chrome", meta: "Kumasi, Ghana · active now", current: true },
  { device: "iPhone 14 · Safari", meta: "Kumasi, Ghana · 2 hours ago", current: false },
  { device: "Infinix Note · Chrome", meta: "Accra, Ghana · 3 days ago", current: false },
];

export default function SecurityPage() {
  const { settings, toggleSetting } = useAdmin();

  return (
    <div className="grid max-w-[680px] gap-[18px]" style={{ animation: "kk-rise .5s both" }}>
      <div className="grid gap-[18px] rounded-[18px] border border-ink/10 bg-card p-[clamp(22px,3.5vw,32px)]">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
          Change password
        </h3>
        <label className={labelClass}>
          Current password
          <input type="password" placeholder="••••••••" className={`${fieldClass} max-w-[340px]`} />
        </label>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[18px]">
          <label className={labelClass}>
            New password
            <input type="password" placeholder="At least 10 characters" className={fieldClass} />
          </label>
          <label className={labelClass}>
            Confirm new password
            <input type="password" placeholder="Repeat it" className={fieldClass} />
          </label>
        </div>
        <button
          type="button"
          className="cursor-pointer justify-self-start rounded-full border-none bg-ink px-[30px] py-3.5 font-sans text-[14.5px] font-semibold text-cream transition-colors hover:bg-accent"
        >
          Update password
        </button>
      </div>

      <div className="grid gap-4 rounded-[18px] border border-ink/10 bg-card p-[clamp(22px,3.5vw,32px)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
              Two-factor authentication
            </h3>
            <p className="max-w-[44ch] text-[14px] leading-[1.6] text-ink/65">
              A WhatsApp code is required when signing in from a new device.
            </p>
          </div>
          <ToggleSwitch
            on={settings.twofa}
            onToggle={() => toggleSetting("twofa")}
            label="Toggle two-factor authentication"
          />
        </div>
      </div>

      <div className="rounded-[18px] border border-ink/10 bg-card p-[clamp(22px,3.5vw,32px)]">
        <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
          Active sessions
        </h3>
        <div className="grid">
          {SESSIONS.map((ss) => (
            <div
              key={ss.device}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-b border-ink/[0.08] py-3.5"
            >
              <div>
                <div className="text-[14.5px] font-semibold">{ss.device}</div>
                <div className="mt-0.5 text-[12.5px] text-ink/55">{ss.meta}</div>
              </div>
              {ss.current ? (
                <span className="rounded-full bg-[#2E6B3F]/[0.12] px-3 py-[5px] text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#2E6B3F]">
                  This device
                </span>
              ) : (
                <button
                  type="button"
                  className="cursor-pointer rounded-full border-[1.5px] border-danger/35 bg-transparent px-[18px] py-2 text-[13px] font-semibold text-danger transition-colors hover:bg-danger/[0.08]"
                >
                  Sign out
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent pt-4 text-[14px] font-semibold text-danger underline"
        >
          Sign out of all other sessions
        </button>
      </div>
    </div>
  );
}
