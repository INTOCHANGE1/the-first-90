import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { WHEEL_DEBRIEF, type WheelDebriefShape } from "@/lib/content/phase-1";
import { WheelDebriefClient } from "./WheelDebriefClient";

export default async function WheelDebriefPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("wheel_entries")
    .select("debrief")
    .eq("user_id", user.id)
    .eq("moment", "phase_1_start")
    .maybeSingle();

  const debrief =
    (entry?.debrief as WheelDebriefShape | null | undefined) ?? {};

  return (
    <PageShell>
      <PageHeader backHref="/journal/phase/1" />
      <PageMain>
        <MicroLabel>{WHEEL_DEBRIEF.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {WHEEL_DEBRIEF.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {WHEEL_DEBRIEF.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>
        <WheelDebriefClient initialDebrief={debrief} />
      </PageMain>
    </PageShell>
  );
}
