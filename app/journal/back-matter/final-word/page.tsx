import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { PullQuote } from "@/components/ui/PullQuote";
import { FINAL_WORD } from "@/lib/content/back-matter";

export default async function FinalWordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <PageShell>
      <PageHeader backHref="/journal/back-matter" />
      <PageMain>
        <MicroLabel>{FINAL_WORD.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {FINAL_WORD.title}
        </h1>

        <div className="flex flex-col gap-5">
          {FINAL_WORD.paragraphs.map((p, i) => (
            <p
              key={i}
              className={
                p.length < 30
                  ? "font-serif italic text-xl text-ink"
                  : "text-ink"
              }
            >
              {p}
            </p>
          ))}
          <p className="font-serif italic text-2xl text-ink mt-4">
            {FINAL_WORD.signoff}
          </p>
          <p className="text-sm text-ash">{FINAL_WORD.role}</p>
        </div>

        <div className="mt-12">
          <PullQuote attribution={FINAL_WORD.signoff}>
            {FINAL_WORD.closingQuote}
          </PullQuote>
        </div>

        <p className="mt-12 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
          THE NEW AGE MAN — Helping men become who they were meant to be.
        </p>
      </PageMain>
    </PageShell>
  );
}
