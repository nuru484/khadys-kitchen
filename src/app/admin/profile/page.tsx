"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin/store";

const labelClass =
  "grid gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-ink/60";
const fieldClass =
  "w-full rounded-[12px] border border-ink/20 bg-cream px-4 py-[13px] font-sans text-[15.5px] text-ink outline-none transition-colors focus:border-accent";

export default function ProfilePage() {
  const { profile, saveProfile } = useAdmin();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [saved, setSaved] = useState(false);

  const onSave = () => {
    saveProfile({ name, email, phone });
    setSaved(true);
  };

  return (
    <div className="max-w-[680px]" style={{ animation: "kk-rise .5s both" }}>
      <div className="grid gap-5 rounded-[18px] border border-ink/10 bg-card p-[clamp(22px,3.5vw,32px)]">
        <div className="flex flex-wrap items-center gap-[18px] border-b border-ink/10 pb-5">
          <span className="grid h-[72px] w-[72px] place-items-center rounded-full bg-accent font-serif text-[26px] text-[#FDFAF3]">
            KA
          </span>
          <div>
            <div className="font-serif text-[24px]">Khady Asante</div>
            <div className="mt-[3px] text-[13.5px] text-ink/60">
              Owner · Head Baker · Admin since 2024
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[18px]">
          <label className={labelClass}>
            Full name
            <input value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} className={fieldClass} />
          </label>
          <label className={labelClass}>
            Role
            <input
              value="Owner · Admin"
              readOnly
              className="w-full rounded-[12px] border border-ink/10 bg-oat px-4 py-[13px] font-sans text-[15.5px] text-ink/60 outline-none"
            />
          </label>
          <label className={labelClass}>
            Email
            <input value={email} onChange={(e) => { setEmail(e.target.value); setSaved(false); }} className={fieldClass} />
          </label>
          <label className={labelClass}>
            Phone / WhatsApp
            <input value={phone} onChange={(e) => { setPhone(e.target.value); setSaved(false); }} className={fieldClass} />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            className="cursor-pointer rounded-full border-none bg-accent px-[30px] py-3.5 font-sans text-[14.5px] font-semibold text-[#FDFAF3] transition-colors hover:bg-ink"
          >
            Save changes
          </button>
          {saved ? <span className="text-[14px] font-semibold text-[#2E6B3F]">Saved ✓</span> : null}
        </div>
      </div>
    </div>
  );
}
