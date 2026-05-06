import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { Card } from "@/components/ui/Card";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { PAGE_KEYS } from "@/lib/content/front-matter";
import { computeDayInfo, isSundayInTZ } from "@/lib/utils/dayNumber";
import { WHEEL_SEGMENTS } from "@/lib/wheel";

type CtaSpec = {
  preTitle: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

export default async function JournalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "display_name, started_at, timezone, invite_code_used",
    )
    .eq("id", user.id)
    .single();

  if (!profile?.invite_code_used) redirect("/signup");

  const dayInfo = computeDayInfo({
    startedAt: profile?.started_at,
    timezone: profile?.timezone,
  });

  const todayDay = dayInfo.dayNumber ?? 1;
  const phase = dayInfo.phase ?? 1;
  const weekNumber = dayInfo.weekNumber ?? 1;
  const isSunday = isSundayInTZ(dayInfo.todayLocal);

  // ---- Front matter completion --------------------------------------------
  const { data: frontMatterEntries } = await supabase
    .from("front_matter_entries")
    .select("page_key, signed_at")
    .eq("user_id", user.id);
  const signedKeys = new Set(
    (frontMatterEntries ?? [])
      .filter((e) => !!e.signed_at)
      .map((e) => e.page_key),
  );
  const lineSigned = signedKeys.has(PAGE_KEYS.LINE_IN_SAND);
  const becomingSigned = signedKeys.has(PAGE_KEYS.WHO_BECOMING);
  const frontMatterIncomplete = !lineSigned || !becomingSigned;

  // ---- Phase-1 deep-work completion (lightweight check) -------------------
  const [
    { data: wheel },
    { data: pillars },
    { data: routines },
    { data: phase1Habits },
  ] = await Promise.all([
    supabase
      .from("wheel_entries")
      .select("ratings")
      .eq("user_id", user.id)
      .eq("moment", "phase_1_start")
      .maybeSingle(),
    supabase
      .from("four_pillars_entries")
      .select("self_text, partner_text, children_text, work_text")
      .eq("user_id", user.id)
      .eq("moment", "audit")
      .maybeSingle(),
    supabase
      .from("morning_night_routines")
      .select("routine_type, description")
      .eq("user_id", user.id),
    supabase
      .from("phase_habit_grids")
      .select("habits")
      .eq("user_id", user.id)
      .eq("phase", 1)
      .maybeSingle(),
  ]);
  const wheelComplete = WHEEL_SEGMENTS.every(
    (s) =>
      typeof (wheel?.ratings as Record<string, unknown> | null)?.[s.key] ===
      "number",
  );
  const morningRoutine = routines?.find((r) => r.routine_type === "morning");
  const nightRoutine = routines?.find((r) => r.routine_type === "night");
  const habitsNamed =
    (phase1Habits?.habits ?? []).filter((h) => h.trim()).length === 5;
  const phase1Complete =
    wheelComplete &&
    !!pillars?.self_text?.trim() &&
    !!morningRoutine?.description?.trim() &&
    !!nightRoutine?.description?.trim() &&
    habitsNamed;

  // ---- Today's daily entry + this week's weekly entry ---------------------
  const { data: today } = await supabase
    .from("daily_entries")
    .select("morning_completed_at, evening_completed_at")
    .eq("user_id", user.id)
    .eq("day_number", todayDay)
    .maybeSingle();
  const morningDone = !!today?.morning_completed_at;
  const eveningDone = !!today?.evening_completed_at;

  const { data: thisWeek } = await supabase
    .from("weekly_entries")
    .select("focus_completed_at, review_completed_at")
    .eq("user_id", user.id)
    .eq("week_number", weekNumber)
    .maybeSingle();
  const focusDone = !!thisWeek?.focus_completed_at;
  const reviewDone = !!thisWeek?.review_completed_at;

  // ---- Phase reset state --------------------------------------------------
  const { data: resets } = await supabase
    .from("phase_resets")
    .select("phase, completed_at")
    .eq("user_id", user.id);
  const resetDone = (p: number) =>
    !!resets?.find((r) => r.phase === p && r.completed_at);

  // ---- Pick today's CTA ---------------------------------------------------
  const cta = pickCta({
    frontMatterIncomplete,
    lineSigned,
    phase1Complete,
    todayDay,
    weekNumber,
    phase,
    isSunday,
    focusDone,
    reviewDone,
    morningDone,
    eveningDone,
    resetDone,
    finished: dayInfo.finished,
  });

  const name = profile?.display_name?.split(" ")[0] ?? "friend";
  const greeting = isSunday
    ? `Sunday, ${name}.`
    : eveningDone
      ? `${dayLabel(dayInfo.todayLocal)} done, ${name}.`
      : `Morning, ${name}.`;

  return (
    <PageShell>
      <PageHeader day={todayDay} phase={phase} />
      <PageMain>
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash mb-3">
          PHASE {phase} · DAY {todayDay} / 90 · WEEK {weekNumber}
        </p>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink mb-12">
          {greeting}
        </h1>

        {cta && (
          <Card variant="active" className="mb-8">
            <MicroLabel className="text-bone/70">{cta.preTitle}</MicroLabel>
            <h2 className="text-bone text-2xl md:text-[28px] font-medium mt-2">
              {cta.title}
            </h2>
            <p className="text-bone/80 text-sm mt-2">{cta.body}</p>
            <Link
              href={cta.href}
              className="inline-flex items-center gap-1.5 mt-5 text-[11px] font-medium uppercase tracking-[0.12em] text-bone hover:opacity-80"
            >
              {cta.cta}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Card>
        )}

        {!cta && (
          <Card className="mb-8">
            <MicroLabel>TODAY</MicroLabel>
            <h2 className="text-2xl md:text-[28px] font-medium mt-2">
              All done for today.
            </h2>
            <p className="text-steel text-sm mt-2 italic font-serif">
              The man who shows up on the boring days is the man who finishes.
            </p>
          </Card>
        )}

        <ul className="flex flex-col">
          {phase1Complete && (
            <DashboardLink
              href={`/journal/day/${todayDay}`}
              label={`Today (Day ${todayDay})`}
            />
          )}
          {phase1Complete && (
            <DashboardLink
              href={`/journal/week/${weekNumber}`}
              label={`This week (Week ${weekNumber})`}
            />
          )}
          <DashboardLink
            href={`/journal/phase/${phase}`}
            label={`Phase ${phase}`}
          />
          <DashboardLink href="/journal/front-matter" label="Front matter" />
          <DashboardLink href="/settings" label="Settings" />
        </ul>

        <p className="mt-16 text-sm text-steel">
          Fell off?{" "}
          <Link
            href="/reset"
            className="text-ink underline underline-offset-4"
          >
            Read this.
          </Link>
        </p>
      </PageMain>
    </PageShell>
  );
}

function DashboardLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center justify-between py-4 border-t border-line group hover:bg-bone-warm/40 -mx-4 md:-mx-6 px-4 md:px-6 transition-colors"
      >
        <span className="text-base text-ink">{label}</span>
        <ChevronRight className="w-4 h-4 text-ash group-hover:text-ink" />
      </Link>
      <div className="border-b border-line" />
    </li>
  );
}

function dayLabel(todayLocal: string): string {
  const [y, m, d] = todayLocal.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(undefined, {
    weekday: "long",
    timeZone: "UTC",
  });
}

/**
 * Priority order for "today's call to action":
 * 1. End-of-journal (day > 84) → final review
 * 2. Phase reset due (end of phase 1/2/3 and not yet committed)
 * 3. Front matter incomplete
 * 4. Phase 1 deep work incomplete
 * 5. Sunday review (if Sunday and review not done)
 * 6. Weekly focus (if Monday-ish and focus not done)
 * 7. Morning page (if morning not done)
 * 8. Evening page (morning done, evening not done)
 * 9. null → "all done for today"
 */
function pickCta(s: {
  frontMatterIncomplete: boolean;
  lineSigned: boolean;
  phase1Complete: boolean;
  todayDay: number;
  weekNumber: number;
  phase: 1 | 2 | 3;
  isSunday: boolean;
  focusDone: boolean;
  reviewDone: boolean;
  morningDone: boolean;
  eveningDone: boolean;
  resetDone: (p: number) => boolean;
  finished: boolean;
}): CtaSpec | null {
  if (s.finished) {
    return {
      preTitle: "DAY 90",
      title: "Close the journal.",
      body: "Twelve weeks. Read what you wrote. Mark what changed.",
      href: "/journal/back-matter/final-review",
      cta: "Open the final review",
    };
  }

  // Phase reset: due on the day AFTER the last day of a phase, until done
  if (s.todayDay > 28 && !s.resetDone(1)) {
    return {
      preTitle: "PHASE 1 · RESET",
      title: "Reset before you build.",
      body: "Twenty-eight days. Don't move into Phase 2 without naming what you saw.",
      href: "/journal/phase/1/reset",
      cta: "Open the reset",
    };
  }
  if (s.todayDay > 56 && !s.resetDone(2)) {
    return {
      preTitle: "PHASE 2 · RESET",
      title: "Reset before you lead.",
      body: "Phase 2 closes here. Phase 3 starts with truth.",
      href: "/journal/phase/2/reset",
      cta: "Open the reset",
    };
  }

  if (s.frontMatterIncomplete) {
    const slug = !s.lineSigned ? "line-in-sand" : "who-becoming";
    return {
      preTitle: "TODAY",
      title: "Continue front matter",
      body: !s.lineSigned
        ? "Sign The Line in the Sand. The work doesn't start until you draw it."
        : "One page left. Who you're becoming, on the page.",
      href: `/journal/front-matter/${slug}`,
      cta: "Open page",
    };
  }

  if (!s.phase1Complete) {
    return {
      preTitle: "PHASE 1 · DEEP WORK",
      title: "See clearly first.",
      body: "The deep-work pages come before the dailies. Wheel, gap, pillars, integrity. No spin.",
      href: "/journal/phase/1",
      cta: "Open Phase 1",
    };
  }

  if (s.isSunday && !s.reviewDone) {
    return {
      preTitle: "SUNDAY · REVIEW",
      title: "Make this week wisdom.",
      body: "Skip the review and you keep repeating the same week.",
      href: `/journal/week/${s.weekNumber}#sunday-review`,
      cta: "Open Sunday review",
    };
  }

  if (!s.focusDone && s.todayDay % 7 === 1) {
    // Day 1 of the week (Monday-equivalent in 1-7 numbering — first day of week)
    return {
      preTitle: "MONDAY · FOCUS",
      title: "Set the week's line.",
      body: "Three non-negotiables you will not break this week.",
      href: `/journal/week/${s.weekNumber}#focus`,
      cta: "Open weekly focus",
    };
  }

  if (!s.morningDone) {
    return {
      preTitle: "MORNING",
      title: "How are you starting today?",
      body: "Mantra, three gratitudes, three non-negotiables. Set the tone before the day takes it.",
      href: `/journal/day/${s.todayDay}#morning`,
      cta: "Open morning page",
    };
  }

  if (!s.eveningDone) {
    return {
      preTitle: "EVENING",
      title: "Close out today honestly.",
      body: "Did you keep your word? What was the win? What's one thing for tomorrow?",
      href: `/journal/day/${s.todayDay}#evening`,
      cta: "Open evening page",
    };
  }

  return null;
}
