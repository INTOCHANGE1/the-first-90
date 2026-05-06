import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { PHASE_1_HABIT_GRID_SETUP } from "@/lib/content/phase-1";
import { HabitGridSetupClient } from "./HabitGridSetupClient";

export default async function Phase1HabitGridPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("phase_habit_grids")
    .select("habits, reflection")
    .eq("user_id", user.id)
    .eq("phase", 1)
    .maybeSingle();

  return (
    <PageShell>
      <PageHeader backHref="/journal/phase/1" />
      <PageMain>
        <MicroLabel>{PHASE_1_HABIT_GRID_SETUP.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {PHASE_1_HABIT_GRID_SETUP.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {PHASE_1_HABIT_GRID_SETUP.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>
        <HabitGridSetupClient
          initial={{
            habits: entry?.habits ?? [],
            reflection: entry?.reflection ?? "",
          }}
        />
      </PageMain>
    </PageShell>
  );
}
