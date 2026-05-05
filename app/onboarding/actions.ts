"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveOnboardingProfile(formData: FormData): Promise<void> {
  const displayName = String(formData.get("display_name") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "").trim();

  if (!displayName) {
    throw new Error("display_name required");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      timezone: timezone || "UTC",
    })
    .eq("id", user.id);

  if (error) throw error;

  redirect("/journal/front-matter/line-in-sand");
}
