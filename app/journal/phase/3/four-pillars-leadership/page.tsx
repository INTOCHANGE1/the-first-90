import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { FOUR_PILLARS_LEADERSHIP } from "@/lib/content/phase-3";
import { FourPillarsLeadershipClient } from "./FourPillarsLeadershipClient";

export default async function FourPillarsLeadershipPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("four_pillars_entries")
    .select("self_text, partner_text, children_text, work_text, reflection")
    .eq("user_id", user.id)
    .eq("moment", "leadership")
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
      <PageHeader phase={3} backHref="/journal/phase/3" />
      <PageMain>
        <MicroLabel>{FOUR_PILLARS_LEADERSHIP.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {FOUR_PILLARS_LEADERSHIP.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {FOUR_PILLARS_LEADERSHIP.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>
        <FourPillarsLeadershipClient initial={initial} />
      </PageMain>
    </PageShell>
  );
}
