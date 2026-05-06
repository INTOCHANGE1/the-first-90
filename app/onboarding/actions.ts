"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function isValidTimezone(tz: string): boolean {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export async function saveOnboardingProfile(formData: FormData): Promise<void> {
  const displayName = String(formData.get("display_name") ?? "").trim();
  const rawTimezone = String(formData.get("timezone") ?? "").trim();

  if (!displayName) {
    throw new Error("display_name required");
  }

  // Server-side guard: reject anything Intl doesn't recognise so the
  // dashboard's day-numbering math never gets a poisoned value. Falls back
  // to UTC instead of throwing back at the client; bad data has already been
  // caught by the dropdown UI in the happy path.
  const timezone = isValidTimezone(rawTimezone) ? rawTimezone : "UTC";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      timezone,
    })
    .eq("id", user.id);

  if (error) throw error;

  redirect("/journal/front-matter/line-in-sand");
}
