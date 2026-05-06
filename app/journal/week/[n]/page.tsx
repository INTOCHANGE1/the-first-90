import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import type {
  WeeklyFocusContent,
  SundayReviewContent,
} from "@/lib/content/weekly";
import { FocusSection } from "./FocusSection";
import { SundayReviewSection } from "./SundayReviewSection";

const TOTAL_WEEKS = 12;

export default async function WeekPage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const weekNumber = Number(n);
  if (
    !Number.isFinite(weekNumber) ||
    weekNumber < 1 ||
    weekNumber > TOTAL_WEEKS
  ) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const phase = (weekNumber <= 4 ? 1 : weekNumber <= 8 ? 2 : 3) as 1 | 2 | 3;

  const { data: entry } = await supabase
    .from("weekly_entries")
    .select(
      "focus, sunday_review, focus_completed_at, review_completed_at",
    )
    .eq("user_id", user.id)
    .eq("week_number", weekNumber)
    .maybeSingle();

  const focus =
    (entry?.focus as WeeklyFocusContent | null | undefined) ?? {};
  const review =
    (entry?.sunday_review as SundayReviewContent | null | undefined) ?? {};

  return (
    <PageShell>
      <PageHeader phase={phase} backHref="/journal" />
      <PageMain>
        <MicroLabel>
          WEEK {weekNumber} / {TOTAL_WEEKS} · PHASE {phase}
        </MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-12">
          Week {weekNumber}
        </h1>

        <FocusSection
          weekNumber={weekNumber}
          phase={phase}
          initial={focus}
          alreadyComplete={!!entry?.focus_completed_at}
        />

        <hr className="my-12 border-line" />

        <SundayReviewSection
          weekNumber={weekNumber}
          phase={phase}
          initial={review}
          alreadyComplete={!!entry?.review_completed_at}
        />
      </PageMain>
    </PageShell>
  );
}
