"use client";

import { cn } from "@/lib/utils/cn";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

type SaveIndicatorProps = {
  status: SaveStatus;
  lastSavedAt?: Date | null;
  className?: string;
};

function formatTime(d: Date) {
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SaveIndicator({
  status,
  lastSavedAt,
  className,
}: SaveIndicatorProps) {
  let body: string;
  let tone = "text-ash";

  switch (status) {
    case "saving":
      body = "Saving…";
      break;
    case "saved":
      body = lastSavedAt ? `Saved · ${formatTime(lastSavedAt)}` : "Saved";
      break;
    case "error":
      body = "Connection's off. Your last words might not have saved.";
      tone = "text-blood";
      break;
    case "idle":
    default:
      body = lastSavedAt ? `Saved · ${formatTime(lastSavedAt)}` : "";
  }

  if (!body) return null;

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.12em] transition-opacity",
        tone,
        className,
      )}
    >
      {body}
    </span>
  );
}
