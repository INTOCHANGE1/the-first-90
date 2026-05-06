import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { WHEEL } from "@/lib/content/phase-1";
import type { WheelRatings } from "@/components/journal/WheelOfLife";
import { WheelClient } from "./WheelClient";

export default async function WheelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("wheel_entries")
    .select("ratings")
    .eq("user_id", user.id)
    .eq("moment", "phase_1_start")
    .maybeSingle();

  const ratings = (entry?.ratings as WheelRatings | null | undefined) ?? {};

  return (
    <PageShell>
      <PageHeader backHref="/journal/phase/1" />
      <PageMain>
        <MicroLabel>{WHEEL.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {WHEEL.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {WHEEL.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
          <p className="text-sm text-ash">{WHEEL.hint}</p>
        </div>
        <WheelClient initialRatings={ratings} />
      </PageMain>
    </PageShell>
  );
}
