import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { H3, MicroLabel } from "@/components/ui/SectionHeading";
import { ReaderShell } from "@/components/journal/ReaderShell";
import { WHO_THIS_IS_FOR } from "@/lib/content/front-matter";

export default async function WhoThisIsForPage() {
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
          Who this is for
        </h1>
        <ReaderShell nextHref="/journal/front-matter/how-to-use">
          <div className="flex flex-col gap-6">
            <p className="text-ink text-lg">{WHO_THIS_IS_FOR.intro}</p>

            <section className="flex flex-col gap-3">
              <H3>{WHO_THIS_IS_FOR.forYou.heading}</H3>
              <ul className="flex flex-col gap-2">
                {WHO_THIS_IS_FOR.forYou.bullets.map((b, i) => (
                  <li key={i} className="text-ink pl-6 relative">
                    <span className="absolute left-0 top-3 w-2 h-px bg-blood" />
                    {b}
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <H3>{WHO_THIS_IS_FOR.notForYou.heading}</H3>
              <ul className="flex flex-col gap-2">
                {WHO_THIS_IS_FOR.notForYou.bullets.map((b, i) => (
                  <li key={i} className="text-ink pl-6 relative">
                    <span className="absolute left-0 top-3 w-2 h-px bg-ash" />
                    {b}
                  </li>
                ))}
              </ul>
            </section>

            <p className="font-serif italic text-xl text-ink mt-4">
              {WHO_THIS_IS_FOR.closer}
            </p>
          </div>
        </ReaderShell>
      </PageMain>
    </PageShell>
  );
}
