import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { GAP_BE, type GapBeShape } from "@/lib/content/phase-1";
import { BeClient } from "./BeClient";

export default async function GapBePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("gap_entries")
    .select("be")
    .eq("user_id", user.id)
    .maybeSingle();

  const initial = (entry?.be as GapBeShape | null | undefined) ?? {};

  return (
    <PageShell>
      <PageHeader backHref="/journal/phase/1" />
      <PageMain>
        <MicroLabel>{GAP_BE.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {GAP_BE.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {GAP_BE.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>
        <BeClient initial={initial} />
      </PageMain>
    </PageShell>
  );
}
