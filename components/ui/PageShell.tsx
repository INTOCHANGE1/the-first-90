import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-full flex flex-col bg-bone", className)}>
      {children}
    </div>
  );
}

type PageHeaderProps = {
  day?: number;
  phase?: number;
  backHref?: string;
  className?: string;
};

export function PageHeader({
  day,
  phase,
  backHref,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 bg-bone/95 backdrop-blur border-b border-line px-4 md:px-6 py-3",
        className,
      )}
    >
      <div className="max-w-[720px] mx-auto flex justify-between items-center">
        <div className="flex items-baseline gap-3">
          {backHref ? (
            <a
              href={backHref}
              className="text-sm font-medium tracking-wide text-ink hover:underline underline-offset-4"
            >
              ← THE FIRST 90
            </a>
          ) : (
            <span className="text-sm font-medium tracking-wide text-ink">
              THE FIRST 90
            </span>
          )}
          {day !== undefined && (
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
              DAY {day} / 90
            </span>
          )}
        </div>
        {phase !== undefined && (
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-blood">
            PHASE {phase}
          </span>
        )}
      </div>
    </header>
  );
}

export function PageMain({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 py-8 md:py-12 pb-32 md:pb-12",
        className,
      )}
    >
      {children}
    </main>
  );
}

export function StickyActionBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 bg-bone/95 backdrop-blur border-t border-line px-4 md:px-6 py-3",
        className,
      )}
    >
      <div className="max-w-[720px] mx-auto flex justify-between items-center gap-4">
        {children}
      </div>
    </div>
  );
}
