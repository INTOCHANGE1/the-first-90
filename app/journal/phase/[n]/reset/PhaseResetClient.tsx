"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Textarea } from "@/components/ui/Textarea";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { Button } from "@/components/ui/Button";
import { MicroLabel } from "@/components/ui/SectionHeading";
import {
  PHASE_RESETS,
  type PhaseResetReflections,
} from "@/lib/content/phase-resets";

type Props = {
  phase: 1 | 2 | 3;
  initial: PhaseResetReflections;
  alreadyComplete: boolean;
};

export function PhaseResetClient({
  phase,
  initial,
  alreadyComplete,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const reset = PHASE_RESETS[phase];

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<PhaseResetReflections>(initial, async (reflections) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("not signed in");
      const { error } = await supabase.from("phase_resets").upsert(
        { user_id: user.id, phase, reflections },
        { onConflict: "user_id,phase" },
      );
      if (error) throw error;
    });

  async function commitReset() {
    await flush();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("phase_resets").upsert(
      {
        user_id: user.id,
        phase,
        reflections: data,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,phase" },
    );
    router.push("/journal");
  }

  const filled = reset.prompts.some((p) => (data[p.key] ?? "").trim());

  return (
    <div className="flex flex-col gap-8">
      {reset.prompts.map((prompt) => (
        <div key={prompt.key} className="flex flex-col gap-2">
          <MicroLabel>{prompt.label}</MicroLabel>
          <Textarea
            value={data[prompt.key] ?? ""}
            onChange={(e) =>
              setData((p) => ({ ...p, [prompt.key]: e.target.value }))
            }
            onBlur={() => void flush()}
            bloodAccent
          />
        </div>
      ))}

      <p className="font-serif italic text-xl text-ink mt-4">
        {reset.closer}
      </p>

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-line">
        <SaveIndicator status={status} lastSavedAt={lastSavedAt} />
        <Button onClick={commitReset} disabled={!filled}>
          {alreadyComplete ? "Update reset" : "Commit reset"}
        </Button>
      </div>
    </div>
  );
}
