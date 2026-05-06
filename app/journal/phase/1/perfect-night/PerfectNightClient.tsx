"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { FormFooter } from "@/components/journal/FormFooter";
import { PERFECT_NIGHT } from "@/lib/content/phase-1";

type Shape = {
  description: string;
  non_negotiables: string[];
  reflection: string;
};

export function PerfectNightClient({ initial }: { initial: Shape }) {
  const supabase = useMemo(() => createClient(), []);

  const { data, setData, status, lastSavedAt, flush } = useAutosave<Shape>(
    {
      ...initial,
      non_negotiables:
        initial.non_negotiables.length === 5
          ? initial.non_negotiables
          : ["", "", "", "", ""].map(
              (_, i) => initial.non_negotiables[i] ?? "",
            ),
    },
    async (next) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("not signed in");
      const { error } = await supabase.from("morning_night_routines").upsert(
        { user_id: user.id, routine_type: "night", ...next },
        { onConflict: "user_id,routine_type" },
      );
      if (error) throw error;
    },
  );

  function setNN(i: number, value: string) {
    setData((p) => {
      const arr = [...p.non_negotiables];
      arr[i] = value;
      return { ...p, non_negotiables: arr };
    });
  }

  const filled = !!data.description.trim() || data.non_negotiables.some((n) => n.trim());

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <MicroLabel>{PERFECT_NIGHT.descriptionLabel}</MicroLabel>
        <p className="text-sm text-ash">{PERFECT_NIGHT.descriptionHint}</p>
        <Textarea
          value={data.description ?? ""}
          onChange={(e) =>
            setData((p) => ({ ...p, description: e.target.value }))
          }
          onBlur={() => void flush()}
          bloodAccent
        />
      </section>

      <section className="flex flex-col gap-3">
        <MicroLabel>{PERFECT_NIGHT.nonNegotiablesLabel}</MicroLabel>
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Input
              key={i}
              value={data.non_negotiables[i] ?? ""}
              onChange={(e) => setNN(i, e.target.value)}
              onBlur={() => void flush()}
              placeholder={`${i + 1}.`}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <MicroLabel>{PERFECT_NIGHT.reflectionLabel}</MicroLabel>
        <Textarea
          value={data.reflection ?? ""}
          onChange={(e) =>
            setData((p) => ({ ...p, reflection: e.target.value }))
          }
          onBlur={() => void flush()}
          bloodAccent
        />
      </section>

      <FormFooter
        status={status}
        lastSavedAt={lastSavedAt}
        flush={flush}
        nextHref="/journal/phase/1/habit-grid"
        canContinue={filled}
      />
    </div>
  );
}
