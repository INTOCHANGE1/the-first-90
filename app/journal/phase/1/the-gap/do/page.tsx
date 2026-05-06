import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { GAP_DO, type GapDoShape } from "@/lib/content/phase-1";
import { DoClient } from "./DoClient";

export default async function GapDoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("gap_entries")
    .select("do_section")
    .eq("user_id", user.id)
    .maybeSingle();

  const initial =
    (entry?.do_section as GapDoShape | null | undefined) ?? {};

  return (
    <PageShell>
      <PageHeader backHref="/journal/phase/1" />
      <PageMain>
        <MicroLabel>{GAP_DO.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {GAP_DO.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {GAP_DO.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>
        <DoClient initial={initial} />
      </PageMain>
    </PageShell>
  );
}
