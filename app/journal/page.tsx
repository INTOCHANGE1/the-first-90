import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { Card } from "@/components/ui/Card";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { PAGE_KEYS } from "@/lib/content/front-matter";

export default async function JournalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, current_day, current_phase, invite_code_used")
    .eq("id", user.id)
    .single();

  if (!profile?.invite_code_used) redirect("/signup");

  const { data: frontMatterEntries } = await supabase
    .from("front_matter_entries")
    .select("page_key, signed_at")
    .eq("user_id", user.id);

  const signedKeys = new Set(
    (frontMatterEntries ?? [])
      .filter((e) => !!e.signed_at)
      .map((e) => e.page_key),
  );

  const lineSigned = signedKeys.has(PAGE_KEYS.LINE_IN_SAND);
  const becomingSigned = signedKeys.has(PAGE_KEYS.WHO_BECOMING);
  const frontMatterIncomplete = !lineSigned || !becomingSigned;

  const name = profile?.display_name?.split(" ")[0] ?? "friend";
  const day = profile?.current_day ?? 1;
  const phase = profile?.current_phase ?? 1;

  // Pick the next unsigned page so the CTA points to actionable work.
  const nextFrontMatterSlug = !lineSigned
    ? "line-in-sand"
    : !becomingSigned
      ? "who-becoming"
      : null;

  return (
    <PageShell>
      <PageHeader day={day} phase={phase} />
      <PageMain>
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash mb-3">
          PHASE {phase} · DAY {day} / 90
        </p>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink mb-12">
          Morning, {name}.
        </h1>

        {frontMatterIncomplete && nextFrontMatterSlug && (
          <Card variant="active" className="mb-8">
            <MicroLabel className="text-bone/70">TODAY</MicroLabel>
            <h2 className="text-bone text-2xl md:text-[28px] font-medium mt-2">
              Continue front matter
            </h2>
            <p className="text-bone/80 text-sm mt-2">
              {!lineSigned
                ? "Sign The Line in the Sand. The work doesn't start until you draw it."
                : "One page left. Who you're becoming, on the page."}
            </p>
            <Link
              href={`/journal/front-matter/${nextFrontMatterSlug}`}
              className="inline-flex items-center gap-1.5 mt-5 text-[11px] font-medium uppercase tracking-[0.12em] text-bone hover:opacity-80"
            >
              Open page
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Card>
        )}

        {!frontMatterIncomplete && (
          <Card variant="active" className="mb-8">
            <MicroLabel className="text-bone/70">PHASE 1 · DEEP WORK</MicroLabel>
            <h2 className="text-bone text-2xl md:text-[28px] font-medium mt-2">
              See clearly first.
            </h2>
            <p className="text-bone/80 text-sm mt-2">
              Twelve pages of self-discovery before the daily work begins.
              Wheel of Life, the Gap, four pillars, integrity, the man you
              have been. No spin. Truth on the page.
            </p>
            <Link
              href="/journal/phase/1"
              className="inline-flex items-center gap-1.5 mt-5 text-[11px] font-medium uppercase tracking-[0.12em] text-bone hover:opacity-80"
            >
              Open Phase 1
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Card>
        )}

        <ul className="flex flex-col">
          <DashboardLink
            href="/journal/phase/1"
            label="Phase 1 — Self-discovery"
          />
          <DashboardLink
            href="/journal/front-matter"
            label="Front matter"
          />
          <DashboardLink href="/settings" label="Settings" />
        </ul>

        <p className="mt-16 text-sm text-steel">
          Fell off?{" "}
          <Link
            href="/reset"
            className="text-ink underline underline-offset-4"
          >
            Read this.
          </Link>
        </p>
      </PageMain>
    </PageShell>
  );
}

function DashboardLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center justify-between py-4 border-t border-line group hover:bg-bone-warm/40 -mx-4 md:-mx-6 px-4 md:px-6 transition-colors"
      >
        <span className="text-base text-ink">{label}</span>
        <ChevronRight className="w-4 h-4 text-ash group-hover:text-ink" />
      </Link>
      <div className="border-b border-line" />
    </li>
  );
}
