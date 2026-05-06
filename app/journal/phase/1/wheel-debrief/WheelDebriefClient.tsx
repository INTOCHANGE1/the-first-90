"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { FormFooter } from "@/components/journal/FormFooter";
import {
  WHEEL_DEBRIEF,
  type WheelDebriefShape,
} from "@/lib/content/phase-1";

type Props = {
  initialDebrief: WheelDebriefShape;
};

export function WheelDebriefClient({ initialDebrief }: Props) {
  const supabase = useMemo(() => createClient(), []);

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<WheelDebriefShape>(
      {
        excelling: initialDebrief.excelling ?? ["", "", ""],
        struggling: initialDebrief.struggling ?? ["", "", ""],
        why_strong: initialDebrief.why_strong ?? "",
        why_weak: initialDebrief.why_weak ?? "",
        tradeoffs: initialDebrief.tradeoffs ?? "",
      },
      async (debrief) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("not signed in");
        const { error } = await supabase.from("wheel_entries").upsert(
          {
            user_id: user.id,
            moment: "phase_1_start",
            debrief,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,moment" },
        );
        if (error) throw error;
      },
    );

  function setExcelling(i: number, value: string) {
    setData((prev) => {
      const arr = [...(prev.excelling ?? ["", "", ""])];
      arr[i] = value;
      return { ...prev, excelling: arr };
    });
  }
  function setStruggling(i: number, value: string) {
    setData((prev) => {
      const arr = [...(prev.struggling ?? ["", "", ""])];
      arr[i] = value;
      return { ...prev, struggling: arr };
    });
  }

  const filled = (data.excelling ?? []).some((v) => v.trim()) ||
    (data.struggling ?? []).some((v) => v.trim()) ||
    !!data.why_strong?.trim();

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <MicroLabel>{WHEEL_DEBRIEF.prompts.excelling}</MicroLabel>
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Input
              key={i}
              value={data.excelling?.[i] ?? ""}
              onChange={(e) => setExcelling(i, e.target.value)}
              onBlur={() => void flush()}
              placeholder={`${i + 1}.`}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <MicroLabel>{WHEEL_DEBRIEF.prompts.why_strong}</MicroLabel>
        <Textarea
          value={data.why_strong ?? ""}
          onChange={(e) => setData((p) => ({ ...p, why_strong: e.target.value }))}
          onBlur={() => void flush()}
          bloodAccent
        />
      </section>

      <section className="flex flex-col gap-3">
        <MicroLabel>{WHEEL_DEBRIEF.prompts.struggling}</MicroLabel>
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Input
              key={i}
              value={data.struggling?.[i] ?? ""}
              onChange={(e) => setStruggling(i, e.target.value)}
              onBlur={() => void flush()}
              placeholder={`${i + 1}.`}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <MicroLabel>{WHEEL_DEBRIEF.prompts.why_weak}</MicroLabel>
        <Textarea
          value={data.why_weak ?? ""}
          onChange={(e) => setData((p) => ({ ...p, why_weak: e.target.value }))}
          onBlur={() => void flush()}
          bloodAccent
        />
      </section>

      <section className="flex flex-col gap-3">
        <MicroLabel>{WHEEL_DEBRIEF.prompts.tradeoffs}</MicroLabel>
        <Textarea
          value={data.tradeoffs ?? ""}
          onChange={(e) => setData((p) => ({ ...p, tradeoffs: e.target.value }))}
          onBlur={() => void flush()}
          bloodAccent
        />
      </section>

      <FormFooter
        status={status}
        lastSavedAt={lastSavedAt}
        flush={flush}
        nextHref="/journal/phase/1/the-gap"
        canContinue={filled}
      />
    </div>
  );
}
