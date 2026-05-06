import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { PullQuote } from "@/components/ui/PullQuote";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  PHASE_1_INTRO,
  PHASE_1_ORDER,
  type WheelDebriefShape,
  type GapHaveShape,
  type GapBeShape,
  type GapDoShape,
} from "@/lib/content/phase-1";
import { WHEEL_SEGMENTS, type WheelRatings } from "@/lib/wheel";

type Completion = Record<(typeof PHASE_1_ORDER)[number]["slug"], boolean>;

export default async function Phase1HubPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const completion = await loadCompletion(supabase, user.id);
  const completedCount = Object.values(completion).filter(Boolean).length;

  return (
    <PageShell>
      <PageHeader phase={1} backHref="/journal" />
      <PageMain>
        <MicroLabel>{PHASE_1_INTRO.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-2">
          Self-Discovery
        </h1>
        <p className="text-sm uppercase tracking-[0.08em] text-ash mb-8">
          {PHASE_1_INTRO.subtitle}
        </p>
        <PullQuote attribution={PHASE_1_INTRO.attribution}>
          {PHASE_1_INTRO.pullQuote}
        </PullQuote>

        <div className="my-8">
          <ProgressBar
            current={completedCount}
            total={PHASE_1_ORDER.length}
            label="DEEP WORK"
          />
        </div>

        <ul className="flex flex-col">
          {PHASE_1_ORDER.map((item, i) => {
            const done = completion[item.slug];
            return (
              <li key={item.slug}>
                <Link
                  href={`/journal/phase/1/${item.slug}`}
                  className="flex items-center justify-between py-5 border-t border-line group hover:bg-bone-warm/40 -mx-4 md:-mx-6 px-4 md:px-6 transition-colors"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base text-ink">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {done ? (
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-blood inline-flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Done
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
                        Open
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-ash group-hover:text-ink" />
                  </div>
                </Link>
              </li>
            );
          })}
          <li className="border-t border-line" />
        </ul>
      </PageMain>
    </PageShell>
  );
}

async function loadCompletion(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<Completion> {
  const completion: Completion = {
    wheel: false,
    "wheel-debrief": false,
    "the-gap": true, // read-only intro; consider it "open" not "complete"
    "the-gap/have": false,
    "the-gap/be": false,
    "the-gap/do": false,
    "four-pillars": false,
    "integrity-inventory": false,
    "man-comparison": false,
    "perfect-morning": false,
    "perfect-night": false,
    "habit-grid": false,
  };

  const [
    wheel,
    gap,
    pillars,
    integrity,
    comparison,
    routines,
    habits,
  ] = await Promise.all([
    supabase
      .from("wheel_entries")
      .select("ratings, debrief")
      .eq("user_id", userId)
      .eq("moment", "phase_1_start")
      .maybeSingle(),
    supabase
      .from("gap_entries")
      .select("have, be, do_section")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("four_pillars_entries")
      .select("self_text, partner_text, children_text, work_text")
      .eq("user_id", userId)
      .eq("moment", "audit")
      .maybeSingle(),
    supabase
      .from("integrity_inventory_entries")
      .select("broken_to_self, broken_to_partner, broken_to_children, broken_to_work")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("man_comparison_entries")
      .select("been, becoming")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("morning_night_routines")
      .select("routine_type, description, non_negotiables")
      .eq("user_id", userId),
    supabase
      .from("phase_habit_grids")
      .select("habits")
      .eq("user_id", userId)
      .eq("phase", 1)
      .maybeSingle(),
  ]);

  // Wheel: all 10 segments rated
  const ratings = (wheel.data?.ratings ?? {}) as WheelRatings;
  completion.wheel = WHEEL_SEGMENTS.every(
    (s) => typeof ratings[s.key] === "number",
  );

  // Wheel debrief: any of the major fields filled
  const debrief = (wheel.data?.debrief ?? {}) as WheelDebriefShape;
  completion["wheel-debrief"] = !!(
    debrief.why_strong?.trim() ||
    debrief.why_weak?.trim() ||
    debrief.tradeoffs?.trim() ||
    (debrief.excelling ?? []).some((s) => s.trim()) ||
    (debrief.struggling ?? []).some((s) => s.trim())
  );

  // Gap pages
  const have = (gap.data?.have ?? {}) as GapHaveShape;
  const be = (gap.data?.be ?? {}) as GapBeShape;
  const doSec = (gap.data?.do_section ?? {}) as GapDoShape;
  completion["the-gap/have"] = Object.values(have).some(
    (v) => typeof v === "string" && v.trim(),
  );
  completion["the-gap/be"] = Object.values(be).some(
    (v) => typeof v === "string" && v.trim(),
  );
  completion["the-gap/do"] = !!(
    doSec.stop?.trim() ||
    doSec.start?.trim() ||
    doSec.one_thing?.trim() ||
    (doSec.goals ?? []).some((g) => g.trim()) ||
    doSec.sacrifices?.trim()
  );

  // Four pillars
  completion["four-pillars"] = !!(
    pillars.data?.self_text?.trim() ||
    pillars.data?.partner_text?.trim() ||
    pillars.data?.children_text?.trim() ||
    pillars.data?.work_text?.trim()
  );

  // Integrity
  completion["integrity-inventory"] = !!(
    integrity.data?.broken_to_self?.trim() ||
    integrity.data?.broken_to_partner?.trim() ||
    integrity.data?.broken_to_children?.trim() ||
    integrity.data?.broken_to_work?.trim()
  );

  // Comparison
  completion["man-comparison"] =
    (comparison.data?.been ?? []).some((s) => s.trim()) ||
    (comparison.data?.becoming ?? []).some((s) => s.trim());

  // Routines
  for (const row of routines.data ?? []) {
    const filled =
      !!row.description?.trim() ||
      (row.non_negotiables ?? []).some((s) => s.trim());
    if (row.routine_type === "morning" && filled)
      completion["perfect-morning"] = true;
    if (row.routine_type === "night" && filled)
      completion["perfect-night"] = true;
  }

  // Habit grid
  completion["habit-grid"] =
    (habits.data?.habits ?? []).filter((h) => h.trim()).length === 5;

  // Treat the read-only "the-gap" intro as complete once user has touched any
  // downstream Gap page, otherwise show it as the live next step.
  completion["the-gap"] =
    completion["the-gap/have"] ||
    completion["the-gap/be"] ||
    completion["the-gap/do"];

  return completion;
}
