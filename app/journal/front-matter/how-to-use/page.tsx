import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { H3, MicroLabel } from "@/components/ui/SectionHeading";
import { ReaderShell } from "@/components/journal/ReaderShell";
import { HOW_TO_USE } from "@/lib/content/front-matter";

export default async function HowToUsePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <PageShell>
      <PageHeader backHref="/journal/front-matter" />
      <PageMain>
        <MicroLabel>FRONT MATTER</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          How to use this journal
        </h1>
        <ReaderShell nextHref="/journal/front-matter/line-in-sand">
          <div className="flex flex-col gap-6">
            <p className="text-ink text-lg">{HOW_TO_USE.intro}</p>

            <div className="flex flex-col gap-5">
              {HOW_TO_USE.phases.map((phase, i) => (
                <section key={i} className="flex flex-col gap-2">
                  <H3>{phase.heading}</H3>
                  <p className="text-ink">{phase.body}</p>
                </section>
              ))}
            </div>

            <section className="flex flex-col gap-3 mt-2">
              <H3>{HOW_TO_USE.structure.heading}</H3>
              <ul className="flex flex-col gap-2">
                {HOW_TO_USE.structure.bullets.map((b, i) => (
                  <li key={i} className="text-ink pl-6 relative">
                    <span className="absolute left-0 top-3 w-2 h-px bg-blood" />
                    {b}
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <H3>{HOW_TO_USE.rules.heading}</H3>
              <ul className="flex flex-col gap-2">
                {HOW_TO_USE.rules.bullets.map((b, i) => (
                  <li key={i} className="text-ink pl-6 relative">
                    <span className="absolute left-0 top-3 w-2 h-px bg-blood" />
                    {b}
                  </li>
                ))}
              </ul>
            </section>

            <p className="font-serif italic text-xl text-ink mt-4">
              {HOW_TO_USE.closer}
            </p>
          </div>
        </ReaderShell>
      </PageMain>
    </PageShell>
  );
}
