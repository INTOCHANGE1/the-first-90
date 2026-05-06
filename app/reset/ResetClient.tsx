"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { RESET, type ResetReflections } from "@/lib/content/reset";
import { submitReset } from "./actions";

export function ResetClient({ missedDays }: { missedDays: number }) {
  const [data, setData] = useState<ResetReflections>({});
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const filled = RESET.prompts.some((p) => (data[p.key] ?? "").trim());

  function onSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        await submitReset({ reflections: data, missedDays });
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Couldn't save your reset.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {RESET.prompts.map((prompt) => (
        <div key={prompt.key} className="flex flex-col gap-2">
          <MicroLabel>{prompt.label}</MicroLabel>
          <Textarea
            value={data[prompt.key] ?? ""}
            onChange={(e) =>
              setData((p) => ({ ...p, [prompt.key]: e.target.value }))
            }
            bloodAccent
          />
        </div>
      ))}

      {error && <p className="text-sm text-blood">{error}</p>}

      <div className="flex justify-end pt-6 border-t border-line">
        <Button onClick={onSubmit} disabled={!filled || pending}>
          {pending ? "Picking up…" : "I'm back. Take me to today."}
        </Button>
      </div>
    </div>
  );
}
