import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BACK_MATTER_ORDER } from "@/lib/content/back-matter";
import { WHEEL_SEGMENTS, type WheelRatings } from "@/lib/wheel";

export default async function BackMatterHubPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: review }, { data: wheel }] = await Promise.all([
    supabase
      .from("final_reviews")
      .select("most_important_lesson, completed_at")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("wheel_entries")
      .select("ratings, debrief, completed_at")
      .eq("user_id", user.id)
      .eq("moment", "post_90")
      .maybeSingle(),
  ]);

  const reviewDone = !!review?.completed_at;
  const ratings = (wheel?.ratings ?? {}) as WheelRatings;
  const wheelDone = WHEEL_SEGMENTS.every(
    (s) => typeof ratings[s.key] === "number",
  );
  const debrief = wheel?.debrief as { biggest_shift?: string } | null;
  const debriefDone = !!debrief?.biggest_shift?.trim();

  const completion: Record<string, boolean> = {
    "final-review": reviewDone,
    wheel: wheelDone,
    "wheel-debrief": debriefDone,
    "wheel-comparison": wheelDone, // viewable once post-90 wheel filled
    freeform: false, // never "done" — always available
    "next-step": false,
    "final-word": false,
  };
  const trackable = ["final-review", "wheel", "wheel-debrief"] as const;
  const completedCount = trackable.filter((k) => completion[k]).length;

  return (
    <PageShell>
      <PageHeader backHref="/journal" />
      <PageMain>
        <MicroLabel>BACK MATTER</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-2">
          Close the journal.
        </h1>
        <p className="text-base text-steel mt-3 mb-8">
          Ninety days. The review, the wheel, the comparison. Take your time.
          The lessons get locked in here.
        </p>

        <div className="my-8">
          <ProgressBar
            current={completedCount}
            total={trackable.length}
            label="CLOSING WORK"
          />
        </div>

        <ul className="flex flex-col">
          {BACK_MATTER_ORDER.map((item, i) => {
            const done = completion[item.slug];
            const trackedItem = (trackable as readonly string[]).includes(
              item.slug,
            );
            return (
              <li key={item.slug}>
                <Link
                  href={`/journal/back-matter/${item.slug}`}
                  className="flex items-center justify-between py-5 border-t border-line group hover:bg-bone-warm/40 -mx-4 md:-mx-6 px-4 md:px-6 transition-colors"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base text-ink">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {trackedItem && done ? (
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-blood inline-flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Done
                      </span>
                    ) : trackedItem ? (
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
                        Open
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
                        →
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-ash group-hover:text-ink" />
                  </div>
                </Link>
              </li>
            );
          })}
          <li className="border-t border-line" />
        </ul>
      </PageMain>
    </PageShell>
  );
}
