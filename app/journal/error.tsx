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
 * Journal-segment error boundary. Anything that goes wrong inside /journal/**
 * lands here without taking down the whole app.
 */
export default function JournalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageShell>
      <PageHeader backHref="/journal" />
      <PageMain>
        <MicroLabel>JOURNAL ERROR</MicroLabel>
        <h1 className="font-serif italic text-3xl md:text-4xl text-ink leading-tight mt-2 mb-6">
          Couldn&rsquo;t open this page.
        </h1>
        <p className="text-base text-steel mb-8 max-w-md">
          Something hiccuped while loading your work. Your words are safe.
          Try again, or head back to the dashboard.
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
            <a href="/journal">Dashboard</a>
          </Button>
        </div>
      </PageMain>
    </PageShell>
  );
}
