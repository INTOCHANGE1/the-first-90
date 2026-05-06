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
import { WHEEL_SEGMENTS } from "@/lib/wheel";
import {
  SUNDAY_REVIEW,
  type SundayReviewContent,
} from "@/lib/content/weekly";

type Props = {
  weekNumber: number;
  phase: 1 | 2 | 3;
  initial: SundayReviewContent;
  alreadyComplete: boolean;
};

export function SundayReviewSection({
  weekNumber,
  phase,
  initial,
  alreadyComplete,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<SundayReviewContent>(
      {
        ...initial,
        three_best: padArray(initial.three_best, 3),
        ratings: initial.ratings ?? {},
      },
      async (sunday_review) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("not signed in");
        const { error } = await supabase.from("weekly_entries").upsert(
          {
            user_id: user.id,
            week_number: weekNumber,
            phase,
            sunday_review,
          },
          { onConflict: "user_id,week_number" },
        );
        if (error) throw error;
      },
    );

  function setBest(i: number, value: string) {
    setData((p) => {
      const arr = [...(p.three_best ?? ["", "", ""])];
      arr[i] = value;
      return { ...p, three_best: arr };
    });
  }
  function setRating(key: (typeof WHEEL_SEGMENTS)[number]["key"], n: number) {
    setData((p) => ({
      ...p,
      ratings: { ...(p.ratings ?? {}), [key]: n },
    }));
  }

  async function finishReview() {
    await flush();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("weekly_entries").upsert(
      {
        user_id: user.id,
        week_number: weekNumber,
        phase,
        review_completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,week_number" },
    );
    router.push("/journal");
  }

  return (
    <section id="sunday-review" className="flex flex-col gap-8 scroll-mt-20">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-blood">
          {SUNDAY_REVIEW.preTitle}
        </h2>
        {alreadyComplete && (
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
            Done
          </span>
        )}
      </div>
      <p className="text-base text-steel">{SUNDAY_REVIEW.intro}</p>

      <div className="flex flex-col gap-3">
        <MicroLabel>{SUNDAY_REVIEW.threeBestLabel}</MicroLabel>
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Input
              key={i}
              value={data.three_best?.[i] ?? ""}
              onChange={(e) => setBest(i, e.target.value)}
              onBlur={() => void flush()}
              placeholder={`${i + 1}.`}
            />
          ))}
        </div>
      </div>

      {(
        [
          ["grateful_for", SUNDAY_REVIEW.gratefulLabel],
          ["biggest_win", SUNDAY_REVIEW.biggestWinLabel],
          ["biggest_lesson", SUNDAY_REVIEW.biggestLessonLabel],
          ["broke_word", SUNDAY_REVIEW.brokeWordLabel],
          ["lead_better", SUNDAY_REVIEW.leadBetterLabel],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="flex flex-col gap-2">
          <MicroLabel>{label}</MicroLabel>
          <Textarea
            value={(data[key] as string | undefined) ?? ""}
            onChange={(e) => setData((p) => ({ ...p, [key]: e.target.value }))}
            onBlur={() => void flush()}
            bloodAccent
          />
        </div>
      ))}

      <div className="flex flex-col gap-3 pt-2">
        <div>
          <MicroLabel>{SUNDAY_REVIEW.ratingsLabel}</MicroLabel>
          <p className="text-xs text-ash mt-1">{SUNDAY_REVIEW.ratingsHint}</p>
        </div>
        <div className="flex flex-col gap-5">
          {WHEEL_SEGMENTS.map((s) => (
            <RatingPills
              key={s.key}
              label={s.label}
              value={data.ratings?.[s.key] ?? null}
              onChange={(n) => setRating(s.key, n)}
              scale={10}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <MicroLabel>{SUNDAY_REVIEW.doDifferentlyLabel}</MicroLabel>
        <Textarea
          value={data.do_differently ?? ""}
          onChange={(e) =>
            setData((p) => ({ ...p, do_differently: e.target.value }))
          }
          onBlur={() => void flush()}
          bloodAccent
        />
      </div>

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-line">
        <SaveIndicator status={status} lastSavedAt={lastSavedAt} />
        <Button onClick={finishReview}>
          {alreadyComplete ? "Update review" : "Finish Sunday review"}
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
