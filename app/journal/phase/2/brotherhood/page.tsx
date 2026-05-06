import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { PAGE_KEYS } from "@/lib/content/front-matter";
import { BROTHERHOOD, type BrotherhoodContent } from "@/lib/content/phase-2";
import { BrotherhoodClient } from "./BrotherhoodClient";

export default async function BrotherhoodPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("front_matter_entries")
    .select("content, signed_at")
    .eq("user_id", user.id)
    .eq("page_key", PAGE_KEYS.BROTHERHOOD)
    .maybeSingle();

  const content =
    (entry?.content as BrotherhoodContent | null | undefined) ?? {};

  return (
    <PageShell>
      <PageHeader phase={2} backHref="/journal/phase/2" />
      <PageMain>
        <MicroLabel>{BROTHERHOOD.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {BROTHERHOOD.title}
        </h1>
        <BrotherhoodClient
          initialContent={content}
          initialSignedAt={entry?.signed_at ?? null}
        />
      </PageMain>
    </PageShell>
  );
}
