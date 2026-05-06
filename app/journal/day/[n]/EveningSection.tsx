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
import { cn } from "@/lib/utils/cn";
import { EVENING, type EveningContent } from "@/lib/content/daily";

type Props = {
  dayNumber: number;
  phase: 1 | 2 | 3;
  initial: EveningContent;
  alreadyComplete: boolean;
  /** Optional next href — e.g. weekly review on Sunday after evening completion. */
  postCompleteHref?: string;
};

export function EveningSection({
  dayNumber,
  phase,
  initial,
  alreadyComplete,
  postCompleteHref,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<EveningContent>(
      {
        ...initial,
        highlights: padArray(initial.highlights, 3),
      },
      async (evening) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("not signed in");
        const { error } = await supabase.from("daily_entries").upsert(
          { user_id: user.id, day_number: dayNumber, phase, evening },
          { onConflict: "user_id,day_number" },
        );
        if (error) throw error;
      },
    );

  function setRating(key: keyof EveningContent, n: number) {
    setData((p) => ({ ...p, [key]: n }));
  }
  function setHighlight(i: number, value: string) {
    setData((p) => {
      const arr = [...(p.highlights ?? ["", "", ""])];
      arr[i] = value;
      return { ...p, highlights: arr };
    });
  }

  async function finishEvening() {
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
        evening_completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,day_number" },
    );
    if (postCompleteHref) {
      router.push(postCompleteHref);
    } else {
      router.refresh();
    }
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-blood">
          {EVENING.preTitle}
        </h2>
        {alreadyComplete && (
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
            Done
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {EVENING.ratings.map((r) => (
          <RatingPills
            key={r.key}
            label={r.label}
            value={(data[r.key] as number | undefined) ?? null}
            onChange={(n) => setRating(r.key, n)}
            scale={5}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <MicroLabel>{EVENING.waterLabel}</MicroLabel>
        <div className="flex flex-wrap gap-1.5">
          {EVENING.waterOptions.map((opt) => {
            const active = data.water === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setData((p) => ({ ...p, water: opt }))}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded transition-colors",
                  active
                    ? "bg-ink text-bone"
                    : "bg-bone-warm text-ash hover:text-ink",
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <MicroLabel>{EVENING.keptWordLabel}</MicroLabel>
        <div className="flex gap-2 mb-2">
          {[
            { v: true, label: "Yes" },
            { v: false, label: "No" },
          ].map(({ v, label }) => {
            const active = data.kept_word === v;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setData((p) => ({ ...p, kept_word: v }))}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded transition-colors",
                  active
                    ? "bg-ink text-bone"
                    : "bg-bone-warm text-ash hover:text-ink",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
        {data.kept_word === false && (
          <Textarea
            value={data.broke_word_where ?? ""}
            onChange={(e) =>
              setData((p) => ({ ...p, broke_word_where: e.target.value }))
            }
            onBlur={() => void flush()}
            placeholder="Where did you break it?"
            bloodAccent
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <MicroLabel>{EVENING.highlightsLabel}</MicroLabel>
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Input
              key={i}
              value={data.highlights?.[i] ?? ""}
              onChange={(e) => setHighlight(i, e.target.value)}
              onBlur={() => void flush()}
              placeholder={`${i + 1}.`}
            />
          ))}
        </div>
      </div>

      {EVENING.prompts.map((prompt) => (
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
        <Button onClick={finishEvening}>
          {alreadyComplete ? "Update evening" : "Finish evening"}
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
