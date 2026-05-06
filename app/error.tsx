"use client";

import { useEffect } from "react";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { MicroLabel } from "@/components/ui/SectionHeading";

/**
 * App-level error boundary. Catches unhandled errors anywhere in the tree
 * that aren't caught by a more specific segment-level error.tsx.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface error to whichever logging is wired up; for now, console.
    console.error(error);
  }, [error]);

  return (
    <PageShell>
      <PageHeader />
      <PageMain>
        <MicroLabel>SOMETHING FELL OVER</MicroLabel>
        <h1 className="font-serif italic text-3xl md:text-4xl text-ink leading-tight mt-2 mb-6">
          Not your fault. Try again.
        </h1>
        <p className="text-base text-steel mb-8 max-w-md">
          We hit a bump. Tap below to reload this page. If it keeps happening,
          sign out and back in.
        </p>
        {error.digest && (
          <p className="text-xs text-ash mb-8">
            Reference:{" "}
            <code className="text-steel">{error.digest}</code>
          </p>
        )}
        <div className="flex gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary">
            <a href="/journal">Back to journal</a>
          </Button>
        </div>
      </PageMain>
    </PageShell>
  );
}
