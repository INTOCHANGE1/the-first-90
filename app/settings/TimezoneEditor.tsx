"use client";

import { useState, useTransition } from "react";
import { TimezonePicker } from "@/components/forms/TimezonePicker";
import { isValidTimezone } from "@/lib/utils/timezone";
import { updateTimezone } from "./actions";

type Status =
  | { kind: "idle" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export function TimezoneEditor({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const dirty = value !== initial;
  const canSave = dirty && isValidTimezone(value) && !pending;

  function save() {
    setStatus({ kind: "idle" });
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("timezone", value);
        await updateTimezone(fd);
        setStatus({ kind: "saved" });
      } catch (e) {
        setStatus({
          kind: "error",
          message:
            e instanceof Error ? e.message : "Couldn’t save the timezone.",
        });
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <TimezonePicker value={value} onChange={setValue} />
      <div className="flex items-center gap-3 text-xs">
        <button
          type="button"
          onClick={save}
          disabled={!canSave}
          className="bg-blood text-bone border border-transparent px-4 py-2 rounded font-medium uppercase tracking-[0.12em] transition-colors hover:bg-blood-deep disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {status.kind === "saved" && !dirty && (
          <span className="text-ash">
            Saved. Your day count reflects the new zone.
          </span>
        )}
        {status.kind === "error" && (
          <span className="text-blood">{status.message}</span>
        )}
      </div>
    </div>
  );
}
