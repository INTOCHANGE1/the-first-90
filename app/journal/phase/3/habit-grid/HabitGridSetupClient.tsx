"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Input } from "@/components/ui/Input";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { FormFooter } from "@/components/journal/FormFooter";
import { PHASE_3_HABIT_GRID_SETUP } from "@/lib/content/phase-3";

type Shape = {
  habits: string[];
  reflection: string;
};

export function HabitGridSetupClient({ initial }: { initial: Shape }) {
  const supabase = useMemo(() => createClient(), []);

  const { data, setData, status, lastSavedAt, flush } = useAutosave<Shape>(
    {
      habits:
        initial.habits.length === 5
          ? initial.habits
          : ["", "", "", "", ""].map((_, i) => initial.habits[i] ?? ""),
      reflection: initial.reflection,
    },
    async (next) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("not signed in");
      const { error } = await supabase.from("phase_habit_grids").upsert(
        {
          user_id: user.id,
          phase: 3,
          habits: next.habits,
          reflection: next.reflection,
        },
        { onConflict: "user_id,phase" },
      );
      if (error) throw error;
    },
  );

  function setHabit(i: number, value: string) {
    setData((p) => {
      const arr = [...p.habits];
      arr[i] = value;
      return { ...p, habits: arr };
    });
  }

  const filled = data.habits.every((h) => h.trim());

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-ash">{PHASE_3_HABIT_GRID_SETUP.hint}</p>

      <div className="flex flex-col gap-3">
        <MicroLabel>FIVE NON-NEGOTIABLES</MicroLabel>
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Input
              key={i}
              value={data.habits[i] ?? ""}
              onChange={(e) => setHabit(i, e.target.value)}
              onBlur={() => void flush()}
              placeholder={`Non-negotiable ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <FormFooter
        status={status}
        lastSavedAt={lastSavedAt}
        flush={flush}
        nextHref="/journal/phase/3/reflection"
        canContinue={filled}
        continueLabel="Save & continue"
      />
    </div>
  );
}
