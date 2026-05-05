"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type ReaderShellProps = {
  children: React.ReactNode;
  nextHref: string;
  nextLabel?: string;
  /** Force-enable continue immediately (e.g. on revisit). */
  alreadyRead?: boolean;
};

/**
 * Wraps a read-only journal page with a scroll-to-bottom gate that enables the
 * continue button only after the user has reached the end of the content.
 */
export function ReaderShell({
  children,
  nextHref,
  nextLabel = "Continue",
  alreadyRead,
}: ReaderShellProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [reached, setReached] = useState(!!alreadyRead);
  const router = useRouter();

  useEffect(() => {
    if (alreadyRead) {
      setReached(true);
      return;
    }
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setReached(true);
      },
      { rootMargin: "0px 0px -32px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [alreadyRead]);

  return (
    <div className="flex flex-col gap-6">
      {children}
      <div ref={sentinelRef} />
      <div className="flex items-center justify-between mt-4 pt-6 border-t border-line">
        <p className="text-sm text-ash">
          {reached ? "Take it in. Then continue." : "Read to the end."}
        </p>
        <Button
          disabled={!reached}
          onClick={() => {
            if (reached) router.push(nextHref);
          }}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
