"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createFreeformEntry(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("freeform_entries")
    .insert({ user_id: user.id, content: "" })
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error("create failed");

  revalidatePath("/journal/back-matter/freeform");
  redirect(`/journal/back-matter/freeform/${data.id}`);
}

export async function deleteFreeformEntry(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("freeform_entries")
    .delete()
    .eq("user_id", user.id)
    .eq("id", id);

  revalidatePath("/journal/back-matter/freeform");
  redirect("/journal/back-matter/freeform");
}
