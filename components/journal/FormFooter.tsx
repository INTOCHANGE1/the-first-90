"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SaveIndicator, type SaveStatus } from "@/components/ui/SaveIndicator";

type FormFooterProps = {
  status: SaveStatus;
  lastSavedAt: Date | null;
  flush: () => Promise<void>;
  nextHref: string;
  canContinue?: boolean;
  continueLabel?: string;
};

/**
 * Shared bottom bar for journal form pages: save indicator on the left,
 * "Save & continue" button on the right. Flushes any pending save before
 * navigating so the user never loses words.
 */
export function FormFooter({
  status,
  lastSavedAt,
  flush,
  nextHref,
  canContinue = true,
  continueLabel = "Save & continue",
}: FormFooterProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onContinue() {
    startTransition(async () => {
      await flush();
      router.push(nextHref);
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 pt-6 border-t border-line">
      <SaveIndicator status={status} lastSavedAt={lastSavedAt} />
      <Button onClick={onContinue} disabled={!canContinue || pending}>
        {pending ? "Saving…" : continueLabel}
      </Button>
    </div>
  );
}
