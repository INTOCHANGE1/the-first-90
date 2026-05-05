import * as React from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-blood text-bone hover:bg-blood-deep border border-transparent disabled:opacity-40 disabled:cursor-not-allowed",
  secondary:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-bone disabled:opacity-40 disabled:cursor-not-allowed",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center px-6 py-3 rounded text-xs font-medium uppercase tracking-[0.12em] transition-colors active:scale-[0.98]",
          VARIANT_STYLES[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
