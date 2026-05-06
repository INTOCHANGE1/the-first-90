import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { REFERRAL } from "@/lib/content/back-matter";
import { ReferralForm } from "./ReferralForm";

export default async function ReferralPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <PageShell>
      <PageHeader backHref="/journal/back-matter" />
      <PageMain>
        <MicroLabel>{REFERRAL.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-3xl md:text-4xl text-ink leading-tight mt-2 mb-8">
          {REFERRAL.title}
        </h1>
        <div className="flex flex-col gap-4 mb-10">
          {REFERRAL.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>

        <ReferralForm />

        <p className="mt-12 text-sm text-ash italic">{REFERRAL.closer}</p>

        <p className="mt-12 text-sm text-steel">
          Done?{" "}
          <Link
            href="/journal/back-matter/final-word"
            className="text-ink underline underline-offset-4"
          >
            Read the final word.
          </Link>
        </p>
      </PageMain>
    </PageShell>
  );
}
