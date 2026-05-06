import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { FOUR_PILLARS_AUDIT } from "@/lib/content/phase-1";
import { FourPillarsClient } from "./FourPillarsClient";

export default async function FourPillarsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("four_pillars_entries")
    .select("self_text, partner_text, children_text, work_text, reflection")
    .eq("user_id", user.id)
    .eq("moment", "audit")
    .maybeSingle();

  const initial = {
    self_text: entry?.self_text ?? "",
    partner_text: entry?.partner_text ?? "",
    children_text: entry?.children_text ?? "",
    work_text: entry?.work_text ?? "",
    reflection: entry?.reflection ?? "",
  };

  return (
    <PageShell>
      <PageHeader backHref="/journal/phase/1" />
      <PageMain>
        <MicroLabel>{FOUR_PILLARS_AUDIT.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {FOUR_PILLARS_AUDIT.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {FOUR_PILLARS_AUDIT.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>
        <FourPillarsClient initial={initial} />
      </PageMain>
    </PageShell>
  );
}
