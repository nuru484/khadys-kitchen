import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

export type ButtonVariant =
  | "primary"
  | "dark"
  | "outline"
  | "ghost"
  | "danger"
  | "success";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-[#FDFAF3] hover:bg-ink",
  dark: "bg-ink text-cream hover:bg-accent",
  outline: "border-[1.5px] border-ink/25 bg-transparent text-ink hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-ink hover:bg-ink/[0.06]",
  danger: "bg-danger text-[#FDFAF3] hover:opacity-90",
  success: "bg-[#2E6B3F] text-[#FDFAF3]",
};

// Responsive: compact on mobile, a step up on tablet, and the original size from
// lg up (so desktop is unchanged).
const SIZES: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-[12.5px] lg:px-4 lg:text-[13px]",
  md: "px-4 py-2.5 text-[13px] md:px-5 md:py-3 md:text-[14px] lg:px-7 lg:py-3.5 lg:text-[14.5px]",
  lg: "px-5 py-3 text-[14px] md:px-6 md:py-3.5 lg:px-8 lg:py-4 lg:text-[15px]",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and disables the button. */
  isLoading?: boolean;
  /** Label to show while loading (defaults to the normal children). */
  loadingText?: string;
}

/**
 * Brand button with the design's states - default, loading (spinner), disabled,
 * and a `success` variant. Loading forces `disabled` so it can't double-submit.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading = false,
    loadingText,
    disabled,
    className,
    children,
    type = "button",
    ...props
  },
  ref,
) {
  const onDarkFill = variant === "primary" || variant === "dark" || variant === "danger" || variant === "success";
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full font-sans font-semibold tracking-[0.02em] transition-colors disabled:cursor-not-allowed",
        !isLoading && "disabled:bg-ink/[0.12] disabled:text-ink/45 disabled:border-transparent",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {isLoading ? <Spinner onAccent={onDarkFill} /> : null}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
});
