import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { Showcase } from "./Showcase";

export const metadata = {
  title: "Components — The First 90",
  robots: { index: false, follow: false },
};

/**
 * Visual regression / development showcase.
 *
 * Gated by sign-in (the proxy doesn't cover /dev because we want the page to
 * render styled even without env wiring), so anyone hitting it sees real
 * components against real auth. Not linked from anywhere production-facing.
 */
export default async function DevComponentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dev/components");

  return (
    <PageShell>
      <PageHeader />
      <PageMain>
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash mb-2">
          INTERNAL · COMPONENT LIBRARY
        </p>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight">
          The Blood palette
        </h1>
        <p className="text-base text-steel mt-3">
          Every component, on bone. If anything looks off here, fix it here
          before fixing it anywhere it&rsquo;s used.
        </p>
        <Showcase />
      </PageMain>
    </PageShell>
  );
}
