import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { FINAL_REVIEW } from "@/lib/content/back-matter";
import { FinalReviewClient } from "./FinalReviewClient";

export default async function FinalReviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("final_reviews")
    .select(
      "most_important_lesson, habit_for_life, relationships_changed, who_am_i_when_alone, truth_now_known, still_needs_work, committing_to, completed_at",
    )
    .eq("user_id", user.id)
    .maybeSingle();

  const initial = {
    most_important_lesson: entry?.most_important_lesson ?? "",
    habit_for_life: entry?.habit_for_life ?? "",
    relationships_changed: entry?.relationships_changed ?? "",
    who_am_i_when_alone: entry?.who_am_i_when_alone ?? "",
    truth_now_known: entry?.truth_now_known ?? "",
    still_needs_work: entry?.still_needs_work ?? "",
    committing_to: entry?.committing_to ?? "",
  };

  return (
    <PageShell>
      <PageHeader backHref="/journal/back-matter" />
      <PageMain>
        <MicroLabel>{FINAL_REVIEW.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {FINAL_REVIEW.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {FINAL_REVIEW.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>
        <FinalReviewClient
          initial={initial}
          alreadyComplete={!!entry?.completed_at}
        />
      </PageMain>
    </PageShell>
  );
}
