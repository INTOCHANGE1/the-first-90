"use client";

import { cn } from "@/lib/utils/cn";

type RatingPillsProps = {
  value: number | null | undefined;
  onChange: (next: number) => void;
  scale?: 5 | 10;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export function RatingPills({
  value,
  onChange,
  scale = 5,
  label,
  className,
  disabled,
}: RatingPillsProps) {
  const options = Array.from({ length: scale }, (_, i) => i + 1);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
          {label}
        </span>
      )}
      <div
        role="radiogroup"
        aria-label={label}
        className={cn(
          "flex gap-1.5",
          scale === 10 && "flex-wrap",
        )}
      >
        {options.map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={disabled}
              onClick={() => onChange(n)}
              className={cn(
                "flex-1 min-w-9 py-2.5 text-sm font-medium rounded transition-colors",
                active
                  ? "bg-ink text-bone"
                  : "bg-bone-warm text-ash hover:text-ink",
                disabled && "opacity-40 cursor-not-allowed",
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
