"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeDayInfo } from "@/lib/utils/dayNumber";
import type { ResetReflections } from "@/lib/content/reset";

export async function submitReset(input: {
  reflections: ResetReflections;
  missedDays: number;
}): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("reset_events").insert({
    user_id: user.id,
    missed_days: Number.isFinite(input.missedDays) ? input.missedDays : null,
    reflections: input.reflections,
  });

  // Route the user back to today's page so they pick up where they are now.
  const { data: profile } = await supabase
    .from("profiles")
    .select("started_at, timezone")
    .eq("id", user.id)
    .single();
  const info = computeDayInfo({
    startedAt: profile?.started_at,
    timezone: profile?.timezone,
  });
  const today = Math.min(Math.max(info.dayNumber ?? 1, 1), 84);
  redirect(`/journal/day/${today}`);
}
