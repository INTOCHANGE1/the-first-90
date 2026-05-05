import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { OnboardingFlow } from "./OnboardingFlow";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, timezone, invite_code_used")
    .eq("id", user.id)
    .single();

  if (!profile?.invite_code_used) redirect("/signup");

  // The OAuth-derived display_name is "Ben Lowe"; we keep the full string but
  // the UI defaults the editable field to it so users can choose first-name only.
  return (
    <PageShell>
      <PageHeader />
      <PageMain>
        <OnboardingFlow
          initial={{
            displayName: profile?.display_name ?? "",
            timezone: profile?.timezone ?? "",
          }}
        />
      </PageMain>
    </PageShell>
  );
}
