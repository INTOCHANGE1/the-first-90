import { cn } from "@/lib/utils/cn";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

/** Bone-warm placeholder block with a subtle pulse. Used in loading.tsx. */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded bg-bone-warm animate-pulse",
        className,
      )}
      {...props}
    />
  );
}
