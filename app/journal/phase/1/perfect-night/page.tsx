import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { PERFECT_NIGHT } from "@/lib/content/phase-1";
import { PerfectNightClient } from "./PerfectNightClient";

export default async function PerfectNightPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("morning_night_routines")
    .select("description, non_negotiables, reflection")
    .eq("user_id", user.id)
    .eq("routine_type", "night")
    .maybeSingle();

  return (
    <PageShell>
      <PageHeader backHref="/journal/phase/1" />
      <PageMain>
        <MicroLabel>{PERFECT_NIGHT.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {PERFECT_NIGHT.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {PERFECT_NIGHT.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>
        <PerfectNightClient
          initial={{
            description: entry?.description ?? "",
            non_negotiables: entry?.non_negotiables ?? [],
            reflection: entry?.reflection ?? "",
          }}
        />
      </PageMain>
    </PageShell>
  );
}
