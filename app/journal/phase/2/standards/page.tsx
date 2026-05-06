import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { PAGE_KEYS } from "@/lib/content/front-matter";
import { STANDARDS, type StandardsContent } from "@/lib/content/phase-2";
import { StandardsClient } from "./StandardsClient";

export default async function StandardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: entry }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single(),
    supabase
      .from("front_matter_entries")
      .select("content, signed_at")
      .eq("user_id", user.id)
      .eq("page_key", PAGE_KEYS.STANDARDS)
      .maybeSingle(),
  ]);

  const content =
    (entry?.content as StandardsContent | null | undefined) ?? {};

  return (
    <PageShell>
      <PageHeader phase={2} backHref="/journal/phase/2" />
      <PageMain>
        <MicroLabel>{STANDARDS.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {STANDARDS.title}
        </h1>
        <StandardsClient
          initialContent={content}
          initialSignedAt={entry?.signed_at ?? null}
          defaultName={profile?.display_name ?? ""}
        />
      </PageMain>
    </PageShell>
  );
}
