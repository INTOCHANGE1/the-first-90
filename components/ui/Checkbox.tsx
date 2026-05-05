"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type CheckboxProps = {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  ariaLabel?: string;
  className?: string;
};

const SIZE_STYLES = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
};

const ICON_STYLES = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
};

export function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  size = "md",
  ariaLabel,
  className,
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "inline-flex items-center justify-center rounded-sm border-2 transition-colors",
        SIZE_STYLES[size],
        checked
          ? "bg-blood border-blood"
          : "bg-transparent border-ash hover:border-ink",
        disabled && "opacity-30 cursor-not-allowed hover:border-ash",
        className,
      )}
    >
      {checked && <Check className={cn(ICON_STYLES[size], "text-bone")} />}
    </button>
  );
}
