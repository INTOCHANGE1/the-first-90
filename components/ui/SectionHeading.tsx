import * as React from "react";
import { cn } from "@/lib/utils/cn";

type HProps = React.HTMLAttributes<HTMLHeadingElement>;

export function H1({ className, ...props }: HProps) {
  return (
    <h1
      className={cn(
        "text-[28px] md:text-[32px] font-medium tracking-[-0.01em] leading-tight text-ink",
        className,
      )}
      {...props}
    />
  );
}

export function H2({ className, ...props }: HProps) {
  return (
    <h2
      className={cn(
        "text-[22px] md:text-[24px] font-medium leading-snug text-ink",
        className,
      )}
      {...props}
    />
  );
}

export function H3({ className, ...props }: HProps) {
  return (
    <h3
      className={cn(
        "text-sm font-medium uppercase tracking-[0.08em] text-ink",
        className,
      )}
      {...props}
    />
  );
}

export function MicroLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.12em] text-ash",
        className,
      )}
      {...props}
    />
  );
}
