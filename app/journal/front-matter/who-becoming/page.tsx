import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import {
  WHO_IM_BECOMING,
  PAGE_KEYS,
  type WhoBecomingContent,
} from "@/lib/content/front-matter";
import { WhoBecomingClient } from "./WhoBecomingClient";

export default async function WhoBecomingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("front_matter_entries")
    .select("content, signed_at")
    .eq("user_id", user.id)
    .eq("page_key", PAGE_KEYS.WHO_BECOMING)
    .maybeSingle();

  const content =
    (entry?.content as WhoBecomingContent | null | undefined) ?? {};

  return (
    <PageShell>
      <PageHeader backHref="/journal/front-matter" />
      <PageMain>
        <MicroLabel>{WHO_IM_BECOMING.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {WHO_IM_BECOMING.title}
        </h1>
        <WhoBecomingClient
          initialContent={content}
          initialSignedAt={entry?.signed_at ?? null}
        />
      </PageMain>
    </PageShell>
  );
}
