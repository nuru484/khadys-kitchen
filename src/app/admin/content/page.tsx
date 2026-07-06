"use client";

import { useState } from "react";
import { Card } from "@/components/admin/ui";
import { siteContentDefaults } from "@/lib/admin/data";

const fieldClass =
  "w-full rounded-[12px] border-[1.5px] border-ink/20 bg-cream px-[15px] py-3 font-sans text-[15px] text-ink outline-none transition-colors focus:border-accent";
const labelClass =
  "grid gap-[7px] text-[12.5px] font-semibold uppercase tracking-[0.06em] text-ink/60";

export default function ContentPage() {
  const [published, setPublished] = useState(false);
  // Any edit invalidates the last "Published" confirmation.
  const reset = () => setPublished(false);

  return (
    <div className="mx-auto max-w-[720px]" style={{ animation: "kk-rise .5s both" }}>
      <Card className="grid gap-6 p-[clamp(20px,3vw,32px)]">
        <div className="grid gap-4">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
            Homepage
          </h3>
          <label className={labelClass}>
            Hero headline
            <input
              className={fieldClass}
              defaultValue={siteContentDefaults.heroHeadline}
              onChange={reset}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Hours · weekdays
              <input
                className={fieldClass}
                defaultValue={siteContentDefaults.hoursWeekday}
                onChange={reset}
              />
            </label>
            <label className={labelClass}>
              Hours · weekend
              <input
                className={fieldClass}
                defaultValue={siteContentDefaults.hoursWeekend}
                onChange={reset}
              />
            </label>
          </div>
        </div>

        <div className="grid gap-4">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
            Bake School &amp; contact
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className={labelClass}>
              Class fee · GHS
              <input
                className={fieldClass}
                defaultValue={siteContentDefaults.classFee}
                onChange={reset}
              />
            </label>
            <label className={labelClass}>
              Hostel fee · GHS
              <input
                className={fieldClass}
                defaultValue={siteContentDefaults.hostelFee}
                onChange={reset}
              />
            </label>
            <label className={labelClass}>
              WhatsApp line
              <input
                className={fieldClass}
                defaultValue={siteContentDefaults.whatsapp}
                onChange={reset}
              />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => setPublished(true)}
            className="cursor-pointer rounded-full bg-accent px-6 py-3 text-[14px] font-semibold text-[#FDFAF3] transition-colors hover:bg-ink"
          >
            Publish changes
          </button>
          {published ? (
            <span className="text-[13.5px] font-semibold text-[#2E6B3F]">Published ✓</span>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
