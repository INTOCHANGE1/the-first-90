import * as React from "react";
import { cn } from "@/lib/utils/cn";

type CardVariant = "default" | "active" | "tinted";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

const VARIANT_STYLES: Record<CardVariant, string> = {
  default: "bg-bone-warm border border-line text-ink",
  active: "bg-ink text-bone border-l-4 border-blood relative",
  tinted: "bg-blood-faint border border-line text-ink",
};

export function Card({
  className,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-6",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    />
  );
}
