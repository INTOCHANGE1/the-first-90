import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, ChevronRight, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { PullQuote } from "@/components/ui/PullQuote";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PAGE_KEYS } from "@/lib/content/front-matter";
import { PHASE_2_INTRO, PHASE_2_ORDER } from "@/lib/content/phase-2";

export default async function Phase2HubPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: fm }, { data: habits }] = await Promise.all([
    supabase
      .from("front_matter_entries")
      .select("page_key, signed_at")
      .eq("user_id", user.id),
    supabase
      .from("phase_habit_grids")
      .select("habits")
      .eq("user_id", user.id)
      .eq("phase", 2)
      .maybeSingle(),
  ]);

  const signedKeys = new Set(
    (fm ?? []).filter((e) => !!e.signed_at).map((e) => e.page_key),
  );
  const standardsSigned = signedKeys.has(PAGE_KEYS.STANDARDS);
  const brotherhoodSigned = signedKeys.has(PAGE_KEYS.BROTHERHOOD);
  const habitsNamed =
    (habits?.habits ?? []).filter((h) => h.trim()).length === 5;

  const completion: Record<string, boolean> = {
    standards: standardsSigned,
    brotherhood: brotherhoodSigned,
    "habit-grid": habitsNamed,
  };
  const completedCount = Object.values(completion).filter(Boolean).length;

  return (
    <PageShell>
      <PageHeader phase={2} backHref="/journal" />
      <PageMain>
        <MicroLabel>{PHASE_2_INTRO.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-2">
          Rebuild
        </h1>
        <p className="text-sm uppercase tracking-[0.08em] text-ash mb-8">
          {PHASE_2_INTRO.subtitle}
        </p>
        <PullQuote attribution={PHASE_2_INTRO.attribution}>
          {PHASE_2_INTRO.pullQuote}
        </PullQuote>

        <div className="flex flex-col gap-4 my-8">
          {PHASE_2_INTRO.body.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>

        <div className="my-8">
          <ProgressBar
            current={completedCount}
            total={PHASE_2_ORDER.length}
            label="DEEP WORK"
          />
        </div>

        <ul className="flex flex-col">
          {PHASE_2_ORDER.map((item, i) => {
            const done = completion[item.slug];
            const showLock = item.kind === "sign";
            return (
              <li key={item.slug}>
                <Link
                  href={`/journal/phase/2/${item.slug}`}
                  className="flex items-center justify-between py-5 border-t border-line group hover:bg-bone-warm/40 -mx-4 md:-mx-6 px-4 md:px-6 transition-colors"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base text-ink">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {done ? (
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-blood inline-flex items-center gap-1.5">
                        {showLock ? (
                          <Lock className="w-3 h-3" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        {showLock ? "Signed" : "Done"}
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
                        Open
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
