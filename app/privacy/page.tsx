import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { H2, MicroLabel } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Privacy — The First 90",
};

/**
 * Placeholder privacy policy. Required for Google OAuth verification and
 * for basic responsibility. Replace with a lawyer-reviewed version before
 * scaling beyond a small soft-launch cohort.
 *
 * The plain-English brand promise here ("the founder cannot read your
 * journal content") is the most important line on this page — it is the
 * trust commitment the recovery audience needs to believe.
 */
export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHeader />
      <PageMain>
        <MicroLabel>THE FIRST 90</MicroLabel>
        <h1 className="font-serif italic text-3xl md:text-4xl text-ink leading-tight mt-2 mb-2">
          Privacy
        </h1>
        <p className="text-sm text-ash mb-8">Last updated: 7 May 2026</p>

        <p className="text-base text-ink mb-8">
          Your writing is yours. The founder cannot read your journal content.
          That is the central promise of this product, and the rest of this
          page exists to back it up.
        </p>

        <H2 className="mt-8 mb-3">What we collect</H2>
        <ul className="flex flex-col gap-2 mb-6 text-ink">
          <li className="pl-6 relative">
            <span className="absolute left-0 top-3 w-2 h-px bg-blood" />
            <strong>Account info</strong>: your name and email, supplied by
            Google when you sign in.
          </li>
          <li className="pl-6 relative">
            <span className="absolute left-0 top-3 w-2 h-px bg-blood" />
            <strong>Journal content</strong>: everything you write inside the
            app. Stored encrypted at rest in our database, accessible only to
            you when signed into your account.
          </li>
          <li className="pl-6 relative">
            <span className="absolute left-0 top-3 w-2 h-px bg-blood" />
            <strong>Usage information</strong>: anonymous metrics like which
            pages were viewed and when. Never your writing.
          </li>
        </ul>

        <H2 className="mt-8 mb-3">What we don&rsquo;t do</H2>
        <ul className="flex flex-col gap-2 mb-6 text-ink">
          <li className="pl-6 relative">
            <span className="absolute left-0 top-3 w-2 h-px bg-blood" />
            We do not read your journal content. Database access controls
            (Row Level Security) prevent the founder, staff, and any third
            party from querying another user&rsquo;s writing.
          </li>
          <li className="pl-6 relative">
            <span className="absolute left-0 top-3 w-2 h-px bg-blood" />
            We do not sell your data. Ever. To anyone.
          </li>
          <li className="pl-6 relative">
            <span className="absolute left-0 top-3 w-2 h-px bg-blood" />
            We do not show advertising inside the app.
          </li>
        </ul>

        <H2 className="mt-8 mb-3">Where your data lives</H2>
        <p className="text-base text-ink mb-6">
          Hosted on Supabase (database) and Vercel (web hosting). Both
          providers operate to industry security standards. The database
          enforces per-user access at the row level.
        </p>

        <H2 className="mt-8 mb-3">Retention and deletion</H2>
        <p className="text-base text-ink mb-6">
          Your data is retained for as long as you have an active account. To
          delete your account and everything in it, email{" "}
          <a
            href="mailto:contactus@intochange.org"
            className="text-ink underline underline-offset-4"
          >
            contactus@intochange.org
          </a>{" "}
          and we&rsquo;ll action it within seven days.
        </p>

        <H2 className="mt-8 mb-3">Contact</H2>
        <p className="text-base text-ink mb-12">
          Privacy questions:{" "}
          <a
            href="mailto:contactus@intochange.org"
            className="text-ink underline underline-offset-4"
          >
            contactus@intochange.org
          </a>
          . The First 90 is a project of THE NEW AGE MAN, an INTOCHANGE
          initiative.
        </p>
      </PageMain>
    </PageShell>
  );
}
