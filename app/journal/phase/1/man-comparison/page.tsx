import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { MAN_COMPARISON } from "@/lib/content/phase-1";
import { ManComparisonClient } from "./ManComparisonClient";

export default async function ManComparisonPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("man_comparison_entries")
    .select("been, becoming")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <PageShell>
      <PageHeader backHref="/journal/phase/1" />
      <PageMain>
        <MicroLabel>{MAN_COMPARISON.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {MAN_COMPARISON.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {MAN_COMPARISON.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>
        <ManComparisonClient
          initial={{
            been: entry?.been ?? [],
            becoming: entry?.becoming ?? [],
          }}
        />
      </PageMain>
    </PageShell>
  );
}
