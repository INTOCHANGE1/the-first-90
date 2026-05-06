"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { RatingPills } from "@/components/ui/RatingPills";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { Button } from "@/components/ui/Button";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { MORNING, type MorningContent } from "@/lib/content/daily";

type Props = {
  dayNumber: number;
  phase: 1 | 2 | 3;
  initial: MorningContent;
  alreadyComplete: boolean;
};

export function MorningSection({
  dayNumber,
  phase,
  initial,
  alreadyComplete,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<MorningContent>(
      {
        ...initial,
        gratitude: padArray(initial.gratitude, 3),
        non_negotiables: padArray(initial.non_negotiables, 3),
      },
      async (morning) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("not signed in");
        const { error } = await supabase.from("daily_entries").upsert(
          { user_id: user.id, day_number: dayNumber, phase, morning },
          { onConflict: "user_id,day_number" },
        );
        if (error) throw error;
      },
    );

  function setRating(key: keyof MorningContent, n: number) {
    setData((p) => ({ ...p, [key]: n }));
  }
  function setListAt(
    key: "gratitude" | "non_negotiables",
    i: number,
    value: string,
  ) {
    setData((p) => {
      const arr = [...(p[key] ?? ["", "", ""])];
      arr[i] = value;
      return { ...p, [key]: arr };
    });
  }

  async function finishMorning() {
    await flush();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("daily_entries").upsert(
      {
        user_id: user.id,
        day_number: dayNumber,
        phase,
        morning_completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,day_number" },
    );
    router.refresh();
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-blood">
          {MORNING.preTitle}
        </h2>
        {alreadyComplete && (
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
            Done
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {MORNING.ratings.map((r) => (
          <RatingPills
            key={r.key}
            label={r.label}
            value={(data[r.key] as number | undefined) ?? null}
            onChange={(n) => setRating(r.key, n)}
            scale={5}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <MicroLabel>{MORNING.mantraLabel}</MicroLabel>
        <Input
          value={data.mantra ?? ""}
          onChange={(e) => setData((p) => ({ ...p, mantra: e.target.value }))}
          onBlur={() => void flush()}
          placeholder="Write what's true."
          bloodAccent
        />
      </div>

      <div className="flex flex-col gap-3">
        <MicroLabel>{MORNING.gratitudeLabel}</MicroLabel>
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Input
              key={i}
              value={data.gratitude?.[i] ?? ""}
              onChange={(e) => setListAt("gratitude", i, e.target.value)}
              onBlur={() => void flush()}
              placeholder={`${i + 1}.`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <MicroLabel>{MORNING.nonNegotiablesLabel}</MicroLabel>
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Input
              key={i}
              value={data.non_negotiables?.[i] ?? ""}
              onChange={(e) =>
                setListAt("non_negotiables", i, e.target.value)
              }
              onBlur={() => void flush()}
              placeholder={`${i + 1}.`}
            />
          ))}
        </div>
      </div>

      {MORNING.prompts.map((prompt) => (
        <div key={prompt.key} className="flex flex-col gap-2">
          <MicroLabel>{prompt.label}</MicroLabel>
          <Textarea
            value={(data[prompt.key] as string | undefined) ?? ""}
            onChange={(e) =>
              setData((p) => ({ ...p, [prompt.key]: e.target.value }))
            }
            onBlur={() => void flush()}
            bloodAccent
          />
        </div>
      ))}

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-line">
        <SaveIndicator status={status} lastSavedAt={lastSavedAt} />
        <Button onClick={finishMorning}>
          {alreadyComplete ? "Update morning" : "Finish morning"}
        </Button>
      </div>
    </section>
  );
}

function padArray(arr: string[] | undefined, len: number): string[] {
  const out = arr ? [...arr] : [];
  while (out.length < len) out.push("");
  return out.slice(0, len);
}
