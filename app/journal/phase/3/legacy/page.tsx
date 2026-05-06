import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { LEGACY } from "@/lib/content/phase-3";
import { LegacyClient } from "./LegacyClient";

export default async function LegacyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Content lives in legacy_entries; signed_at lives on front_matter_entries
  // with page_key='legacy' so the hub progress meter can read it uniformly.
  const [{ data: legacy }, { data: signedRow }] = await Promise.all([
    supabase
      .from("legacy_entries")
      .select(
        "children_remember, partner_say, brotherhood_say, bigger_work, ten_year_legacy",
      )
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("front_matter_entries")
      .select("signed_at")
      .eq("user_id", user.id)
      .eq("page_key", "legacy")
      .maybeSingle(),
  ]);

  const initial = {
    children_remember: legacy?.children_remember ?? "",
    partner_say: legacy?.partner_say ?? "",
    brotherhood_say: legacy?.brotherhood_say ?? "",
    bigger_work: legacy?.bigger_work ?? "",
    ten_year_legacy: legacy?.ten_year_legacy ?? "",
  };

  return (
    <PageShell>
      <PageHeader phase={3} backHref="/journal/phase/3" />
      <PageMain>
        <MicroLabel>{LEGACY.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {LEGACY.title}
        </h1>
        <LegacyClient
          initial={initial}
          initialSignedAt={signedRow?.signed_at ?? null}
        />
      </PageMain>
    </PageShell>
  );
}
