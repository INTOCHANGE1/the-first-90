import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { GAP_HAVE, type GapHaveShape } from "@/lib/content/phase-1";
import { HaveClient } from "./HaveClient";

export default async function GapHavePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("gap_entries")
    .select("have")
    .eq("user_id", user.id)
    .maybeSingle();

  const initial = (entry?.have as GapHaveShape | null | undefined) ?? {};

  return (
    <PageShell>
      <PageHeader backHref="/journal/phase/1" />
      <PageMain>
        <MicroLabel>{GAP_HAVE.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {GAP_HAVE.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {GAP_HAVE.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>
        <HaveClient initial={initial} />
      </PageMain>
    </PageShell>
  );
}
