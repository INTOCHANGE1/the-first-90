"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidTimezone } from "@/lib/utils/timezone";

export async function updateTimezone(formData: FormData): Promise<void> {
  const rawTimezone = String(formData.get("timezone") ?? "").trim();

  if (!isValidTimezone(rawTimezone)) {
    throw new Error("Pick a real timezone from the list.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({ timezone: rawTimezone })
    .eq("id", user.id);

  if (error) throw error;

  // Day-numbering on /journal reads the new timezone, so invalidate any
  // route cache that holds the stale value.
  revalidatePath("/journal");
  revalidatePath("/settings");
}
