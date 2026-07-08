import { Reveal } from "@/components/reveal";
import { formatMoney } from "@/lib/format-money";
import type { ITraining } from "@/types/training.types";

/**
 * The class's fee breakdown — one numbered row per fee item (name, note,
 * price/label/suffix, an "Optional" tag for non-required rows), closed by a
 * computed "Total (required)" line. HOSTEL-kind items are charged only when an
 * applicant requests a place, so they never count toward the required total.
 */
export function FeesTable({ training }: { training: ITraining }) {
  const feeItems = [...(training.feeItems ?? [])].sort(
    (a, b) => a.position - b.position,
  );
  if (feeItems.length === 0) return null;

  const isOptional = (item: (typeof feeItems)[number]) =>
    !item.required || item.kind === "HOSTEL";
  const requiredTotal = feeItems
    .filter((item) => !isOptional(item))
    .reduce((sum, item) => sum + item.amount, 0);
  const hasOptional = feeItems.some(isOptional);

  return (
    <section id="costs" className="border-t border-ink/10 bg-oat">
      <div className="mx-auto max-w-[1080px] px-[clamp(20px,5vw,48px)] py-[clamp(56px,8vw,100px)]">
        <p className="mb-4 text-center text-[13px] font-semibold uppercase tracking-[0.22em] text-accent">
          Fees &amp; what they cover
        </p>
        <Reveal variant="mask" className="text-center">
          <h2 className="mb-3.5 font-serif text-[clamp(32px,4vw,52px)] font-normal">
            Price details
          </h2>
        </Reveal>
        <p className="mx-auto mb-[clamp(36px,5vw,56px)] max-w-[52ch] text-center text-[16px] leading-[1.65] text-ink/65">
          Everything is transparent - here is exactly what this class costs and
          what is covered for you.
        </p>

        <Reveal className="overflow-hidden rounded-[22px] border border-ink/10 bg-card">
          {feeItems.map((item, i) => (
            <div
              key={item.id}
              className="flex flex-col gap-2.5 border-b border-ink/[0.09] px-[clamp(20px,3.5vw,36px)] py-[clamp(20px,3vw,28px)] sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-6"
            >
              <div className="flex items-baseline gap-[18px] sm:flex-[1_1_320px]">
                <span className="min-w-[22px] font-serif text-[15px] text-accent">
                  {i + 1}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="text-[17px] font-semibold">{item.name}</span>
                    {isOptional(item) ? (
                      <span className="rounded-full bg-ink/[0.07] px-2.5 py-[3px] text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/55">
                        Optional
                      </span>
                    ) : null}
                  </div>
                  {item.note ? (
                    <div className="mt-[5px] max-w-[56ch] text-[14.5px] leading-[1.55] text-ink/60">
                      {item.note}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="pl-10 sm:pl-0 sm:text-right">
                <div className="whitespace-nowrap font-serif text-[clamp(18px,2vw,22px)] leading-tight">
                  {item.priceLabel ?? formatMoney(item.amount, training.currency)}
                </div>
                {item.suffix ? (
                  <div className="mt-[5px] font-sans text-[13px] text-ink/55">
                    {item.suffix}
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          {requiredTotal > 0 ? (
            <div className="flex flex-col gap-2.5 bg-sand px-[clamp(20px,3.5vw,36px)] py-[clamp(20px,3vw,28px)] sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-6">
              <div className="flex items-baseline gap-[18px] sm:flex-[1_1_320px]">
                <span aria-hidden="true" className="min-w-[22px]" />
                <div>
                  <div className="text-[17px] font-semibold">Total (required)</div>
                  {hasOptional ? (
                    <div className="mt-[5px] max-w-[56ch] text-[14.5px] leading-[1.55] text-ink/60">
                      Optional items are added only if you choose them.
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="pl-10 sm:pl-0 sm:text-right">
                <div className="whitespace-nowrap font-serif text-[clamp(20px,2.2vw,24px)] leading-tight text-accent">
                  {formatMoney(requiredTotal, training.currency)}
                </div>
              </div>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
