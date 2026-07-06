import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "dark" | "outline";
}

export interface EmptyStateProps {
  /** Small accent kicker above the title. */
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: EmptyStateAction;
  className?: string;
}

const ACTION_VARIANT = {
  primary: "bg-accent text-[#FDFAF3] hover:bg-ink",
  dark: "bg-ink text-cream hover:bg-accent",
  outline:
    "border-[1.5px] border-ink/25 bg-transparent text-ink hover:border-ink/50",
};

function Action({ action }: { action: EmptyStateAction }) {
  const className = cn(
    "cursor-pointer rounded-full px-7 py-3 text-[14px] font-semibold no-underline transition-colors",
    ACTION_VARIANT[action.variant ?? "primary"],
  );
  return action.href ? (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  ) : (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
}

/**
 * Centered empty/idle state — an optional accent eyebrow, a serif headline, a
 * hint, and up to two actions. Icon-less and box-less by design (just centered
 * content); the caller controls the surrounding space. Use whenever a list,
 * search, page, or queue has nothing to show, public site or admin console.
 */
export function EmptyState({
  eyebrow,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center px-[clamp(20px,4vw,40px)] py-[clamp(40px,6vw,72px)] text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-serif text-[clamp(26px,3.4vw,44px)] font-normal leading-[1.1]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3.5 max-w-[46ch] text-[clamp(15px,1.4vw,17px)] leading-[1.65] text-ink/65">
          {description}
        </p>
      ) : null}
      {action ? (
        <div className="mt-8">
          <Action action={action} />
        </div>
      ) : null}
    </div>
  );
}
