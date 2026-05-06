"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Textarea } from "@/components/ui/Textarea";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { FormFooter } from "@/components/journal/FormFooter";
import { GAP_BE, type GapBeShape } from "@/lib/content/phase-1";

export function BeClient({ initial }: { initial: GapBeShape }) {
  const supabase = useMemo(() => createClient(), []);

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<GapBeShape>(initial, async (be) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("not signed in");
      const { error } = await supabase
        .from("gap_entries")
        .upsert({ user_id: user.id, be }, { onConflict: "user_id" });
      if (error) throw error;
    });

  const filled = GAP_BE.prompts.some((p) => (data[p.key] ?? "").trim());

  return (
    <div className="flex flex-col gap-8">
      {GAP_BE.prompts.map((prompt) => (
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
      <FormFooter
        status={status}
        lastSavedAt={lastSavedAt}
        flush={flush}
        nextHref="/journal/phase/1/the-gap/do"
        canContinue={filled}
      />
    </div>
  );
}
