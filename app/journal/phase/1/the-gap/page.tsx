import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { H3, MicroLabel } from "@/components/ui/SectionHeading";
import { PullQuote } from "@/components/ui/PullQuote";
import { ReaderShell } from "@/components/journal/ReaderShell";
import { GAP_INTRO } from "@/lib/content/phase-1";

export default async function GapIntroPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <PageShell>
      <PageHeader backHref="/journal/phase/1" />
      <PageMain>
        <MicroLabel>{GAP_INTRO.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {GAP_INTRO.title}
        </h1>
        <ReaderShell nextHref="/journal/phase/1/the-gap/have">
          <div className="flex flex-col gap-5">
            {GAP_INTRO.intro.map((p, i) => (
              <p key={i} className="text-ink">
                {p}
              </p>
            ))}

            <div className="flex flex-col gap-5 mt-2">
              {GAP_INTRO.steps.map((step) => (
                <section key={step.key} className="flex flex-col gap-2">
                  <H3>{step.heading}</H3>
                  <p className="text-ink">{step.body}</p>
                </section>
              ))}
            </div>

            <p className="text-ink mt-2">{GAP_INTRO.closer}</p>

            <PullQuote attribution="Ben">{GAP_INTRO.pullQuote}</PullQuote>
          </div>
        </ReaderShell>
      </PageMain>
    </PageShell>
  );
}
