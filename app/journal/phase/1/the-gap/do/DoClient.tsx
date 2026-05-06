"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { FormFooter } from "@/components/journal/FormFooter";
import { GAP_DO, type GapDoShape } from "@/lib/content/phase-1";

export function DoClient({ initial }: { initial: GapDoShape }) {
  const supabase = useMemo(() => createClient(), []);

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<GapDoShape>(
      {
        stop: initial.stop ?? "",
        start: initial.start ?? "",
        one_thing: initial.one_thing ?? "",
        goals: initial.goals ?? ["", "", ""],
        sacrifices: initial.sacrifices ?? "",
      },
      async (do_section) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("not signed in");
        const { error } = await supabase
          .from("gap_entries")
          .upsert(
            { user_id: user.id, do_section },
            { onConflict: "user_id" },
          );
        if (error) throw error;
      },
    );

  function setGoal(i: number, value: string) {
    setData((prev) => {
      const arr = [...(prev.goals ?? ["", "", ""])];
      arr[i] = value;
      return { ...prev, goals: arr };
    });
  }

  const filled =
    GAP_DO.prompts.some((p) => (data[p.key] ?? "").trim()) ||
    (data.goals ?? []).some((g) => g.trim()) ||
    !!data.sacrifices?.trim();

  return (
    <div className="flex flex-col gap-8">
      {GAP_DO.prompts.map((prompt) => (
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

      <section className="flex flex-col gap-3">
        <MicroLabel>{GAP_DO.goalsLabel}</MicroLabel>
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Input
              key={i}
              value={data.goals?.[i] ?? ""}
              onChange={(e) => setGoal(i, e.target.value)}
              onBlur={() => void flush()}
              placeholder={`${i + 1}.`}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <MicroLabel>{GAP_DO.sacrificesLabel}</MicroLabel>
        <Textarea
          value={data.sacrifices ?? ""}
          onChange={(e) =>
            setData((p) => ({ ...p, sacrifices: e.target.value }))
          }
          onBlur={() => void flush()}
          bloodAccent
        />
      </section>

      <FormFooter
        status={status}
        lastSavedAt={lastSavedAt}
        flush={flush}
        nextHref="/journal/phase/1/four-pillars"
        canContinue={filled}
      />
    </div>
  );
}
