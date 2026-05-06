import { redirect } from "next/navigation";
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
import { PhaseResetClient } from "@/app/journal/phase/[n]/reset/PhaseResetClient";

/**
 * /journal/phase/3/reflection — End of Phase 3 reflection.
 * Same data shape as /reset (writes to phase_resets, phase=3); different
 * route because the SPEC names this page "reflection" rather than "reset".
 */
export default async function Phase3ReflectionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("phase_resets")
    .select("reflections, completed_at")
    .eq("user_id", user.id)
    .eq("phase", 3)
    .maybeSingle();

  const initial =
    (entry?.reflections as PhaseResetReflections | null | undefined) ?? {};
  const reset = PHASE_RESETS[3];

  return (
    <PageShell>
      <PageHeader phase={3} backHref="/journal/phase/3" />
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
          phase={3}
          initial={initial}
          alreadyComplete={!!entry?.completed_at}
        />
      </PageMain>
    </PageShell>
  );
}
