import Link from "next/link";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { MicroLabel } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Not here — The First 90",
};

export default function NotFound() {
  return (
    <PageShell>
      <PageHeader />
      <PageMain>
        <MicroLabel>404</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-6">
          There&rsquo;s nothing here.
        </h1>
        <p className="text-base text-steel mb-12 max-w-md">
          The page you tried to open doesn&rsquo;t exist, or it never did.
          Head back to your journal and keep going.
        </p>
        <div className="flex gap-3">
          <Button>
            <Link href="/journal">Back to your journal</Link>
          </Button>
          <Button variant="secondary">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </PageMain>
    </PageShell>
  );
}
