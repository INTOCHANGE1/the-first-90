import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import {
  LINE_IN_THE_SAND,
  PAGE_KEYS,
  type LineInSandContent,
} from "@/lib/content/front-matter";
import { LineInSandClient } from "./LineInSandClient";

export default async function LineInSandPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const { data: entry } = await supabase
    .from("front_matter_entries")
    .select("content, signed_at")
    .eq("user_id", user.id)
    .eq("page_key", PAGE_KEYS.LINE_IN_SAND)
    .maybeSingle();

  const content =
    (entry?.content as LineInSandContent | null | undefined) ?? {};

  return (
    <PageShell>
      <PageHeader backHref="/journal/front-matter" />
      <PageMain>
        <MicroLabel>{LINE_IN_THE_SAND.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {LINE_IN_THE_SAND.title}
        </h1>
        <LineInSandClient
          initialContent={content}
          initialSignedAt={entry?.signed_at ?? null}
          defaultName={profile?.display_name ?? ""}
        />
      </PageMain>
    </PageShell>
  );
}
