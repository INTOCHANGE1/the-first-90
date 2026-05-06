"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { Button } from "@/components/ui/Button";
import { MicroLabel } from "@/components/ui/SectionHeading";
import {
  WEEKLY_FOCUS,
  type WeeklyFocusContent,
} from "@/lib/content/weekly";

type Props = {
  weekNumber: number;
  phase: 1 | 2 | 3;
  initial: WeeklyFocusContent;
  alreadyComplete: boolean;
};

export function FocusSection({
  weekNumber,
  phase,
  initial,
  alreadyComplete,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const { data, setData, status, lastSavedAt, flush } =
    useAutosave<WeeklyFocusContent>(
      {
        ...initial,
        three_non_negotiables: padArray(initial.three_non_negotiables, 3),
        weekly_tasks: initial.weekly_tasks ?? {},
      },
      async (focus) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("not signed in");
        const { error } = await supabase.from("weekly_entries").upsert(
          {
            user_id: user.id,
            week_number: weekNumber,
            phase,
            focus,
          },
          { onConflict: "user_id,week_number" },
        );
        if (error) throw error;
      },
    );

  function setNN(i: number, value: string) {
    setData((p) => {
      const arr = [...(p.three_non_negotiables ?? ["", "", ""])];
      arr[i] = value;
      return { ...p, three_non_negotiables: arr };
    });
  }
  function setTask(
    key: (typeof WEEKLY_FOCUS.weekDays)[number]["key"],
    value: string,
  ) {
    setData((p) => ({
      ...p,
      weekly_tasks: { ...(p.weekly_tasks ?? {}), [key]: value },
    }));
  }

  async function finishFocus() {
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
        focus_completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,week_number" },
    );
    router.refresh();
  }

  return (
    <section id="focus" className="flex flex-col gap-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-blood">
          {WEEKLY_FOCUS.preTitle}
        </h2>
        {alreadyComplete && (
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
            Done
          </span>
        )}
      </div>
      <p className="text-base text-steel">{WEEKLY_FOCUS.intro}</p>

      <div className="flex flex-col gap-2">
        <MicroLabel>{WEEKLY_FOCUS.primaryFocusLabel}</MicroLabel>
        <Input
          value={data.primary_focus ?? ""}
          onChange={(e) =>
            setData((p) => ({ ...p, primary_focus: e.target.value }))
          }
          onBlur={() => void flush()}
          bloodAccent
        />
      </div>

      <div className="flex flex-col gap-3">
        <MicroLabel>{WEEKLY_FOCUS.nonNegotiablesLabel}</MicroLabel>
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Input
              key={i}
              value={data.three_non_negotiables?.[i] ?? ""}
              onChange={(e) => setNN(i, e.target.value)}
              onBlur={() => void flush()}
              placeholder={`${i + 1}.`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <MicroLabel>{WEEKLY_FOCUS.lookingForwardLabel}</MicroLabel>
        <Textarea
          value={data.looking_forward ?? ""}
          onChange={(e) =>
            setData((p) => ({ ...p, looking_forward: e.target.value }))
          }
          onBlur={() => void flush()}
          bloodAccent
        />
      </div>

      <div className="flex flex-col gap-2">
        <MicroLabel>{WEEKLY_FOCUS.balanceSituationLabel}</MicroLabel>
        <Textarea
          value={data.balance_situation ?? ""}
          onChange={(e) =>
            setData((p) => ({ ...p, balance_situation: e.target.value }))
          }
          onBlur={() => void flush()}
          bloodAccent
        />
      </div>

      <div className="flex flex-col gap-2">
        <MicroLabel>{WEEKLY_FOCUS.bestSelfLabel}</MicroLabel>
        <Textarea
          value={data.best_self ?? ""}
          onChange={(e) =>
            setData((p) => ({ ...p, best_self: e.target.value }))
          }
          onBlur={() => void flush()}
          bloodAccent
        />
      </div>

      <div className="flex flex-col gap-3">
        <MicroLabel>{WEEKLY_FOCUS.weeklyTasksLabel}</MicroLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {WEEKLY_FOCUS.weekDays.map((d) => (
            <div key={d.key} className="flex items-center gap-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash w-10">
                {d.label}
              </span>
              <Input
                value={data.weekly_tasks?.[d.key] ?? ""}
                onChange={(e) => setTask(d.key, e.target.value)}
                onBlur={() => void flush()}
                placeholder="…"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-line">
        <SaveIndicator status={status} lastSavedAt={lastSavedAt} />
        <Button onClick={finishFocus}>
          {alreadyComplete ? "Update focus" : "Finish weekly focus"}
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
