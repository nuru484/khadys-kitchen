"use client";

import { useState } from "react";
import { Card } from "@/components/admin/ui";
import { Select } from "@/components/ui/Select";
import { inviteRoles, teamMembers, type TeamMember } from "@/lib/admin/data";

function RolePill({ role }: { role: string }) {
  const owner = role === "Owner";
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-3 py-[5px] text-[11.5px] font-semibold uppercase tracking-[0.06em]"
      style={
        owner
          ? { background: "rgba(194,24,91,0.12)", color: "#C2185B" }
          : { background: "rgba(36,26,18,0.08)", color: "#241A12" }
      }
    >
      {role}
    </span>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>(inviteRoles[0]);
  const [error, setError] = useState("");

  const invite = () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address to invite.");
      return;
    }
    const namePart = email
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const initials = namePart
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    setMembers((prev) => [...prev, { name: `${namePart} (invited)`, email, initials, role }]);
    setEmail("");
    setError("");
  };

  return (
    <div className="mx-auto grid max-w-[720px] gap-5" style={{ animation: "kk-rise .5s both" }}>
      <Card className="overflow-hidden">
        {members.map((m) => (
          <div
            key={m.email}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/[0.08] px-[clamp(14px,2.5vw,24px)] py-4"
          >
            <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full bg-ink font-serif text-[14px] text-cream">
              {m.initials}
            </span>
            <div className="min-w-[150px] flex-[1_1_220px]">
              <div className="text-[15px] font-semibold">{m.name}</div>
              <div className="mt-0.5 text-[12.5px] text-ink/55">{m.email}</div>
            </div>
            <RolePill role={m.role} />
          </div>
        ))}
      </Card>

      <Card className="grid gap-4 p-[clamp(20px,3vw,28px)]">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
          Invite a teammate
        </h3>
        {error ? (
          <div
            className="rounded-[12px] border px-4 py-3 text-[13.5px] font-semibold"
            style={{
              color: "#A32036",
              background: "rgba(163,32,54,0.08)",
              borderColor: "rgba(163,32,54,0.25)",
            }}
          >
            {error}
          </div>
        ) : null}
        <div className="flex flex-wrap items-end gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@khadyskitchen.com"
            aria-label="Teammate email"
            className="min-w-[200px] flex-[1_1_240px] rounded-[12px] border-[1.5px] border-ink/20 bg-cream px-[15px] py-3 font-sans text-[15px] text-ink outline-none transition-colors focus:border-accent"
          />
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="Role"
            wrapperClassName="flex-none"
            className="rounded-[12px] border py-3 pl-4 text-[15px]"
          >
            {inviteRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
          <button
            type="button"
            onClick={invite}
            className="cursor-pointer rounded-full bg-accent px-5 py-3 text-[14px] font-semibold text-[#FDFAF3] transition-colors hover:bg-ink"
          >
            Send invite
          </button>
        </div>
        <p className="text-[12.5px] text-ink/55">
          Front desk can record payments and deliveries · Instructors manage classes and
          practicals · Bakers see the order queue.
        </p>
      </Card>
    </div>
  );
}
