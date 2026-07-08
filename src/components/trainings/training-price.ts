import { formatMoney } from "@/lib/format-money";
import type { ITraining } from "@/types/training.types";

/**
 * "From GHS X" entry price for a class — the cheapest required fee item with a
 * real amount (a class can be fee-less, e.g. a free taster; then there is no
 * price to show). Cards, the detail hero, and the sticky apply bar all share it.
 */
export function fromPriceLabel(training: ITraining): string | null {
  const amounts = (training.feeItems ?? [])
    .filter((item) => item.required && item.amount > 0)
    .map((item) => item.amount);
  if (amounts.length === 0) return null;
  return `From ${formatMoney(Math.min(...amounts), training.currency)}`;
}

/** duration · mode, e.g. "2 months · In-person · Kumasi studio". */
export function metaLine(training: ITraining): string | null {
  const parts = [training.duration, training.mode].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}
