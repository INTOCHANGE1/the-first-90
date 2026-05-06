import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { PERFECT_MORNING } from "@/lib/content/phase-1";
import { PerfectMorningClient } from "./PerfectMorningClient";

export default async function PerfectMorningPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("morning_night_routines")
    .select("description, non_negotiables, reflection, benefits")
    .eq("user_id", user.id)
    .eq("routine_type", "morning")
    .maybeSingle();

  return (
    <PageShell>
      <PageHeader backHref="/journal/phase/1" />
      <PageMain>
        <MicroLabel>{PERFECT_MORNING.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {PERFECT_MORNING.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {PERFECT_MORNING.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>
        <PerfectMorningClient
          initial={{
            description: entry?.description ?? "",
            non_negotiables: entry?.non_negotiables ?? [],
            reflection: entry?.reflection ?? "",
            benefits: entry?.benefits ?? "",
          }}
        />
      </PageMain>
    </PageShell>
  );
}
