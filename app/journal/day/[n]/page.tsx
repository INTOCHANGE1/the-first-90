import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import {
  computeDayInfo,
  isSundayInTZ,
  dayLabelInTZ,
  TOTAL_DAYS,
} from "@/lib/utils/dayNumber";
import type { MorningContent, EveningContent } from "@/lib/content/daily";
import { MorningSection } from "./MorningSection";
import { EveningSection } from "./EveningSection";

export default async function DayPage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const dayNumber = Number(n);
  if (!Number.isFinite(dayNumber) || dayNumber < 1 || dayNumber > TOTAL_DAYS) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("started_at, timezone, current_phase")
    .eq("id", user.id)
    .single();

  const dayInfo = computeDayInfo({
    startedAt: profile?.started_at,
    timezone: profile?.timezone,
  });

  // Phase derived from the day being viewed, not the profile's current_phase,
  // so backfill of past days writes to the right phase.
  const phase = (dayNumber <= 28 ? 1 : dayNumber <= 56 ? 2 : 3) as 1 | 2 | 3;
  const weekNumber = Math.ceil(dayNumber / 7);
  const isToday = dayInfo.dayNumber === dayNumber;
  const dayLabel = isToday
    ? dayLabelInTZ(dayInfo.todayLocal)
    : `Day ${dayNumber}`;

  const { data: entry } = await supabase
    .from("daily_entries")
    .select(
      "morning, evening, morning_completed_at, evening_completed_at",
    )
    .eq("user_id", user.id)
    .eq("day_number", dayNumber)
    .maybeSingle();

  const morning = (entry?.morning as MorningContent | null | undefined) ?? {};
  const evening = (entry?.evening as EveningContent | null | undefined) ?? {};

  // After evening completion on Sunday, route to that week's review.
  const sundayWeekHref =
    isToday && isSundayInTZ(dayInfo.todayLocal)
      ? `/journal/week/${weekNumber}#sunday-review`
      : undefined;

  return (
    <PageShell>
      <PageHeader day={dayNumber} phase={phase} backHref="/journal" />
      <PageMain>
        <MicroLabel>
          {dayLabel.toUpperCase()} · DAY {dayNumber} / {TOTAL_DAYS} · WEEK{" "}
          {weekNumber}
        </MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-12">
          {isToday ? "How are you starting today?" : `Day ${dayNumber}`}
        </h1>

        <MorningSection
          dayNumber={dayNumber}
          phase={phase}
          initial={morning}
          alreadyComplete={!!entry?.morning_completed_at}
        />

        <hr className="my-12 border-line" />

        <EveningSection
          dayNumber={dayNumber}
          phase={phase}
          initial={evening}
          alreadyComplete={!!entry?.evening_completed_at}
          postCompleteHref={sundayWeekHref}
        />
      </PageMain>
    </PageShell>
  );
}
