import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { PullQuote } from "@/components/ui/PullQuote";
import { computeDayInfo } from "@/lib/utils/dayNumber";
import { RESET } from "@/lib/content/reset";
import { ResetClient } from "./ResetClient";

export default async function ResetPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("started_at, timezone")
    .eq("id", user.id)
    .single();

  const dayInfo = computeDayInfo({
    startedAt: profile?.started_at,
    timezone: profile?.timezone,
  });
  const todayDay = Math.min(Math.max(dayInfo.dayNumber ?? 1, 1), 84);

  // Count how many of the last 7 days had any completion. Anything more than
  // 3 missing in a row out of those tells the user they fell off, which is
  // why they're here.
  const lookbackStart = Math.max(1, todayDay - 7);
  const { data: recentRows } = await supabase
    .from("daily_entries")
    .select("day_number, morning_completed_at, evening_completed_at")
    .eq("user_id", user.id)
    .gte("day_number", lookbackStart)
    .lt("day_number", todayDay);

  const completedDays = new Set(
    (recentRows ?? [])
      .filter(
        (r) =>
          !!(r.morning_completed_at || r.evening_completed_at),
      )
      .map((r) => r.day_number),
  );
  let missedStreak = 0;
  for (let d = todayDay - 1; d >= lookbackStart; d--) {
    if (completedDays.has(d)) break;
    missedStreak++;
  }

  return (
    <PageShell>
      <PageHeader backHref="/journal" />
      <PageMain>
        <MicroLabel>{RESET.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-3xl md:text-4xl text-ink leading-tight mt-2 mb-2">
          {RESET.title}
        </h1>
        <p className="font-serif italic text-2xl text-ink mb-8">
          {RESET.subtitle}
        </p>
        <div className="flex flex-col gap-4 mb-10">
          {RESET.body.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>

        {missedStreak >= 3 && (
          <p className="text-sm text-ash mb-8">
            You&rsquo;ve missed {missedStreak} day
            {missedStreak === 1 ? "" : "s"}. That&rsquo;s alright. The page
            is here.
          </p>
        )}

        <ResetClient missedDays={missedStreak} />

        <div className="mt-12">
          <PullQuote attribution="Ben">{RESET.pullQuote}</PullQuote>
        </div>
      </PageMain>
    </PageShell>
  );
}
