import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { H2, MicroLabel } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Terms — The First 90",
};

/**
 * Placeholder terms of use. Replace with a lawyer-reviewed version before
 * scaling beyond a small soft-launch cohort.
 */
export default function TermsPage() {
  return (
    <PageShell>
      <PageHeader />
      <PageMain>
        <MicroLabel>THE FIRST 90</MicroLabel>
        <h1 className="font-serif italic text-3xl md:text-4xl text-ink leading-tight mt-2 mb-2">
          Terms of use
        </h1>
        <p className="text-sm text-ash mb-8">Last updated: 7 May 2026</p>

        <H2 className="mt-8 mb-3">What this is</H2>
        <p className="text-base text-ink mb-6">
          The First 90 is a digital journal for men taking on a 12-week
          self-directed transformation program. Access is gated by an invite
          code issued through THE NEW AGE MAN.
        </p>

        <H2 className="mt-8 mb-3">Your account</H2>
        <p className="text-base text-ink mb-6">
          You sign in with Google. You are responsible for keeping your
          Google account secure. One person per code; sharing accounts is not
          permitted.
        </p>

        <H2 className="mt-8 mb-3">What you write is yours</H2>
        <p className="text-base text-ink mb-6">
          You retain ownership of every word you write inside the app. We
          don&rsquo;t claim rights over your journal entries. See the{" "}
          <a
            href="/privacy"
            className="text-ink underline underline-offset-4"
          >
            privacy policy
          </a>{" "}
          for what we do and don&rsquo;t do with your data.
        </p>

        <H2 className="mt-8 mb-3">Acceptable use</H2>
        <p className="text-base text-ink mb-6">
          Use the app for the purpose it&rsquo;s built for. Don&rsquo;t
          attempt to access other users&rsquo; data, abuse the referral form
          to send spam, or upload illegal content.
        </p>

        <H2 className="mt-8 mb-3">No advice</H2>
        <p className="text-base text-ink mb-6">
          The First 90 is a journal, not therapy. The prompts and tone are
          designed for men doing self-directed work; they are not a
          substitute for medical, mental-health, or legal advice. If you are
          in crisis, contact a relevant local service.
        </p>

        <H2 className="mt-8 mb-3">Termination</H2>
        <p className="text-base text-ink mb-6">
          We may suspend or terminate accounts that violate these terms. You
          can close your account at any time by emailing us.
        </p>

        <H2 className="mt-8 mb-3">Changes</H2>
        <p className="text-base text-ink mb-6">
          We&rsquo;ll update these terms from time to time. Significant
          changes will be communicated to you by email or in-app notice.
        </p>

        <H2 className="mt-8 mb-3">Contact</H2>
        <p className="text-base text-ink mb-12">
          Questions:{" "}
          <a
            href="mailto:contactus@intochange.org"
            className="text-ink underline underline-offset-4"
          >
            contactus@intochange.org
          </a>
          .
        </p>
      </PageMain>
    </PageShell>
  );
}
