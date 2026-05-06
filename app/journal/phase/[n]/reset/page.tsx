import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import {
  PHASE_RESETS,
  type PhaseResetReflections,
} from "@/lib/content/phase-resets";
import { PhaseResetClient } from "./PhaseResetClient";

export default async function PhaseResetPage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const phaseRaw = Number(n);
  if (phaseRaw !== 1 && phaseRaw !== 2 && phaseRaw !== 3) notFound();
  const phase = phaseRaw as 1 | 2 | 3;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("phase_resets")
    .select("reflections, completed_at")
    .eq("user_id", user.id)
    .eq("phase", phase)
    .maybeSingle();

  const initial =
    (entry?.reflections as PhaseResetReflections | null | undefined) ?? {};
  const reset = PHASE_RESETS[phase];

  return (
    <PageShell>
      <PageHeader phase={phase} backHref={`/journal/phase/${phase}`} />
      <PageMain>
        <MicroLabel>{reset.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {reset.title}
        </h1>
        <div className="flex flex-col gap-4 mb-10">
          {reset.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>
        <PhaseResetClient
          phase={phase}
          initial={initial}
          alreadyComplete={!!entry?.completed_at}
        />
      </PageMain>
    </PageShell>
  );
}
