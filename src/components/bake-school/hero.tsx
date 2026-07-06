import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format-date";
import type { ITraining } from "@/types/training.types";

// The hero is the only section with a fallback — it must always render well.
const DEFAULT_EYEBROW = "Khady’s Bake School · Kumasi";
const DEFAULT_SUBTEXT =
  "A hands-on programme with practicals every week - you bake, you learn, and you take your cake home. Finish with a CTVET certificate and the confidence to run your own oven.";
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80&auto=format&fit=crop";

export function Hero({ training }: { training: ITraining }) {
  const eyebrow = training.tagline || DEFAULT_EYEBROW;
  const subtext = training.heroSubtext || DEFAULT_SUBTEXT;
  const image = training.coverImage || DEFAULT_IMAGE;
  const heading = training.heroHeading?.trim();
  // Stats are class data — shown only when the cohort defines them.
  const stats = training.stats;
  const open = training.applicationsOpen;

  // Concrete cohort facts — a single clean line, each rendered only when set.
  const dateRange = training.startDate
    ? `${formatDate(training.startDate)}${training.endDate ? ` – ${formatDate(training.endDate)}` : ""}`
    : null;
  const facts: string[] = [];
  if (dateRange) facts.push(dateRange);
  if (training.capacity != null)
    facts.push(`${String(training.capacity)} places`);
  if (training.hostelCapacity != null)
    facts.push(`${String(training.hostelCapacity)} hostel beds`);

  return (
    <section className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-[clamp(32px,5vw,72px)] px-[clamp(20px,5vw,48px)] py-[clamp(48px,7vw,96px)]">
      <div className="min-w-0" style={{ animation: "kk-rise 0.8s ease both" }}>
        {/* One label row: brand + live status. */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.22em] text-accent">
            {eyebrow}
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold",
              open
                ? "bg-[#2E6B3F]/10 text-[#2E6B3F]"
                : "bg-ink/[0.07] text-ink/55",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                open ? "bg-[#2E6B3F]" : "bg-ink/40",
              )}
            />
            {open ? "Applications open" : "Applications closed"}
          </span>
        </div>

        {heading ? (
          <h1
            className="mt-6 font-serif text-[clamp(36px,4.8vw,64px)] font-normal leading-[1.07] text-balance"
            style={{ animation: "kk-fadein .8s .15s both" }}
          >
            {heading}
          </h1>
        ) : (
          <h1 className="mt-6 font-serif text-[clamp(36px,4.8vw,64px)] font-normal leading-[1.07]">
            <span className="block overflow-hidden">
              <span
                className="inline-block"
                style={{
                  animation:
                    "kk-lineup 1s .15s cubic-bezier(.16,.84,.28,1) both",
                }}
              >
                Learn to bake the
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="inline-block"
                style={{
                  animation:
                    "kk-lineup 1s .32s cubic-bezier(.16,.84,.28,1) both",
                }}
              >
                way{" "}
                <em className="font-serif not-italic text-accent">Khady</em>{" "}
                does.
              </span>
            </span>
          </h1>
        )}

        {/* Which cohort — number + name on one refined line. */}
        {training.numeral || training.name ? (
          <p
            className="mt-5 max-w-[34ch] font-serif text-[clamp(18px,1.9vw,23px)] font-normal leading-[1.3] text-ink/75"
            style={{ animation: "kk-fadein .8s .35s both" }}
          >
            {training.numeral ? (
              <span className="text-accent">Cohort {training.numeral}</span>
            ) : null}
            {training.numeral && training.name ? (
              <span className="mx-2 text-ink/30">·</span>
            ) : null}
            {training.name}
          </p>
        ) : null}

        <p
          className="mt-6 max-w-[52ch] text-[clamp(16px,1.4vw,18px)] leading-[1.7] text-ink/70"
          style={{ animation: "kk-fadein .8s .5s both" }}
        >
          {subtext}
        </p>

        {facts.length > 0 ? (
          <div
            className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13.5px] text-ink/60"
            style={{ animation: "kk-fadein .8s .55s both" }}
          >
            {facts.map((f, i) => (
              <span key={f} className="flex items-center gap-x-2.5">
                {i > 0 ? (
                  <span aria-hidden="true" className="text-ink/25">
                    ·
                  </span>
                ) : null}
                {f}
              </span>
            ))}
          </div>
        ) : null}

        <div
          className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3.5"
          style={{ animation: "kk-fadein .8s .6s both" }}
        >
          <a
            href="#apply"
            className="rounded-full bg-accent px-[34px] py-4 text-[15px] font-semibold tracking-[0.06em] text-[#FDFAF3] no-underline transition-colors hover:bg-ink"
          >
            {open ? "Start your application" : "Join the waitlist"}
          </a>
          <a
            href="#costs"
            className="border-b-[1.5px] border-ink/35 px-2 py-4 text-[15px] font-semibold tracking-[0.06em] text-ink no-underline transition-colors hover:border-ink"
          >
            See full costs ↓
          </a>
        </div>

        {stats.length > 0 ? (
          <div
            className="mt-11 flex flex-wrap gap-x-10 gap-y-6 border-t border-ink/15 pt-7"
            style={{ animation: "kk-fadein .8s .7s both" }}
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-[26px]">{stat.value}</div>
                <div className="mt-1 text-[12.5px] uppercase tracking-[0.08em] text-ink/55">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative lg:sticky lg:top-24">
        <Reveal
          variant="mask-img"
          className="relative block h-[clamp(380px,44vw,560px)] w-full overflow-hidden rounded-b-[20px] rounded-t-[min(260px,40vw)] border border-ink/15"
        >
          <Image
            src={image}
            alt="Hands preparing dough in a kitchen"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 45vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
