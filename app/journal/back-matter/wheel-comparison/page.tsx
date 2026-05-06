import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { WheelOfLife } from "@/components/journal/WheelOfLife";
import { WHEEL_COMPARISON } from "@/lib/content/back-matter";
import { WHEEL_SEGMENTS, type WheelRatings, type WheelKey } from "@/lib/wheel";

/**
 * The before / after view.
 *
 * Reads both wheel_entries rows (moment='phase_1_start' and 'post_90'),
 * renders both WheelOfLife components in readOnly mode side-by-side on
 * desktop, stacked on mobile. Below: per-segment delta table so the user
 * can read the numerical change at a glance.
 */
export default async function WheelComparisonPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rows } = await supabase
    .from("wheel_entries")
    .select("moment, ratings, completed_at")
    .eq("user_id", user.id)
    .in("moment", ["phase_1_start", "post_90"]);

  const before =
    (rows?.find((r) => r.moment === "phase_1_start")?.ratings as
      | WheelRatings
      | null
      | undefined) ?? {};
  const after =
    (rows?.find((r) => r.moment === "post_90")?.ratings as
      | WheelRatings
      | null
      | undefined) ?? {};

  const hasBefore = WHEEL_SEGMENTS.some(
    (s) => typeof before[s.key] === "number",
  );
  const hasAfter = WHEEL_SEGMENTS.some(
    (s) => typeof after[s.key] === "number",
  );

  return (
    <PageShell>
      <PageHeader backHref="/journal/back-matter" />
      <PageMain>
        <MicroLabel>{WHEEL_COMPARISON.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {WHEEL_COMPARISON.title}
        </h1>
        <div className="flex flex-col gap-4 mb-12">
          {WHEEL_COMPARISON.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>

        {!hasBefore && (
          <p className="text-sm text-blood mb-8">
            No Phase 1 wheel found yet. Fill it in at{" "}
            <Link
              href="/journal/phase/1/wheel"
              className="text-ink underline underline-offset-4"
            >
              Phase 1 wheel
            </Link>
            .
          </p>
        )}
        {!hasAfter && (
          <p className="text-sm text-blood mb-8">
            No Post-90 wheel yet. Fill it in at{" "}
            <Link
              href="/journal/back-matter/wheel"
              className="text-ink underline underline-offset-4"
            >
              the post-90 wheel
            </Link>
            .
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-12">
          <ComparisonWheel
            label="BEFORE"
            sublabel="Day 1"
            ratings={before}
            empty={!hasBefore}
          />
          <ComparisonWheel
            label="AFTER"
            sublabel="Day 90"
            ratings={after}
            empty={!hasAfter}
          />
        </div>

        {hasBefore && hasAfter && (
          <DeltaTable before={before} after={after} />
        )}

        <div className="flex justify-end mt-12">
          <Button>
            <Link href="/journal/back-matter/final-word">Read the final word</Link>
          </Button>
        </div>
      </PageMain>
    </PageShell>
  );
}

function ComparisonWheel({
  label,
  sublabel,
  ratings,
  empty,
}: {
  label: string;
  sublabel: string;
  ratings: WheelRatings;
  empty: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-baseline gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-blood">
          {label}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
          {sublabel}
        </span>
      </div>
      {empty ? (
        <div className="aspect-square w-full max-w-[320px] flex items-center justify-center border border-line rounded-lg bg-bone-warm/40">
          <span className="text-sm text-ash italic">Not yet filled.</span>
        </div>
      ) : (
        <WheelOfLife ratings={ratings} readOnly size={320} />
      )}
    </div>
  );
}

function DeltaTable({
  before,
  after,
}: {
  before: WheelRatings;
  after: WheelRatings;
}) {
  return (
    <div className="border-t border-line pt-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash mb-4">
        SHIFT
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
        {WHEEL_SEGMENTS.map((s) => {
          const b = before[s.key as WheelKey];
          const a = after[s.key as WheelKey];
          const delta =
            typeof a === "number" && typeof b === "number"
              ? a - b
              : null;
          return (
            <li
              key={s.key}
              className="flex items-baseline justify-between border-b border-line pb-2"
            >
              <span className="text-sm text-ink">{s.label}</span>
              <span className="flex items-baseline gap-2 text-sm">
                <span className="text-ash w-6 text-right">{b ?? "—"}</span>
                <span className="text-ash">→</span>
                <span className="text-ink w-6">{a ?? "—"}</span>
                {delta !== null && (
                  <span
                    className={
                      delta > 0
                        ? "text-blood font-medium w-10 text-right"
                        : delta < 0
                          ? "text-steel w-10 text-right"
                          : "text-ash w-10 text-right"
                    }
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
