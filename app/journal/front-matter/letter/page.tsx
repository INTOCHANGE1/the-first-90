import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { ReaderShell } from "@/components/journal/ReaderShell";
import { LETTER } from "@/lib/content/front-matter";

export default async function LetterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <PageShell>
      <PageHeader backHref="/journal/front-matter" />
      <PageMain>
        <MicroLabel>{LETTER.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          A letter to the man holding this
        </h1>
        <ReaderShell nextHref="/journal/front-matter/who-this-is-for">
          <div className="flex flex-col gap-5">
            {LETTER.paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  i === LETTER.paragraphs.length - 1
                    ? "text-ink text-lg font-medium"
                    : "text-ink"
                }
              >
                {p}
              </p>
            ))}
            <p className="font-serif italic text-xl text-ink mt-4">
              {LETTER.signoff}
            </p>
            <p className="text-sm text-ash">{LETTER.role}</p>
          </div>
        </ReaderShell>
      </PageMain>
    </PageShell>
  );
}
