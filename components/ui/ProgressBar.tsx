import { cn } from "@/lib/utils/cn";

type ProgressBarProps = {
  current: number;
  total: number;
  label?: string;
  className?: string;
};

export function ProgressBar({
  current,
  total,
  label,
  className,
}: ProgressBarProps) {
  const safe = Math.max(0, Math.min(current, total));
  const pct = total === 0 ? 0 : (safe / total) * 100;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={safe}
      aria-label={label}
      className={cn("w-full", className)}
    >
      {label && (
        <div className="flex justify-between text-[11px] font-medium uppercase tracking-[0.12em] text-ash mb-2">
          <span>{label}</span>
          <span>
            {safe} / {total}
          </span>
        </div>
      )}
      <div className="relative h-1 w-full bg-line rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-blood transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
