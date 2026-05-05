import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  FRONT_MATTER_ORDER,
  PAGE_KEYS,
} from "@/lib/content/front-matter";

export default async function FrontMatterIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entries } = await supabase
    .from("front_matter_entries")
    .select("page_key, signed_at")
    .eq("user_id", user.id);

  const signedKeys = new Set(
    (entries ?? [])
      .filter((e) => !!e.signed_at)
      .map((e) => e.page_key),
  );

  const signedCount =
    (signedKeys.has(PAGE_KEYS.LINE_IN_SAND) ? 1 : 0) +
    (signedKeys.has(PAGE_KEYS.WHO_BECOMING) ? 1 : 0);

  return (
    <PageShell>
      <PageHeader backHref="/journal" />
      <PageMain>
        <MicroLabel>FRONT MATTER</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          Before you begin
        </h1>
        <p className="text-base text-steel mb-8">
          Five pages. Three to read, two to sign. Walk through them in order
          the first time. Come back to the signed ones whenever you need to
          remember what you committed to.
        </p>

        <div className="mb-10">
          <ProgressBar
            current={signedCount}
            total={2}
            label="SIGNED PAGES"
          />
        </div>

        <ul className="flex flex-col">
          {FRONT_MATTER_ORDER.map((item, i) => {
            const slugKey =
              item.slug === "line-in-sand"
                ? PAGE_KEYS.LINE_IN_SAND
                : item.slug === "who-becoming"
                  ? PAGE_KEYS.WHO_BECOMING
                  : null;
            const signed = !!slugKey && signedKeys.has(slugKey);
            return (
              <li key={item.slug}>
                <Link
                  href={`/journal/front-matter/${item.slug}`}
                  className="flex items-center justify-between py-5 border-t border-line group hover:bg-bone-warm/40 -mx-4 md:-mx-6 px-4 md:px-6 transition-colors"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base text-ink">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.kind === "sign" && (
                      <span
                        className={
                          signed
                            ? "text-[11px] font-medium uppercase tracking-[0.12em] text-blood inline-flex items-center gap-1.5"
                            : "text-[11px] font-medium uppercase tracking-[0.12em] text-ash"
                        }
                      >
                        {signed ? (
                          <>
                            <Lock className="w-3 h-3" />
                            Signed
                          </>
                        ) : (
                          "Unsigned"
                        )}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-ash group-hover:text-ink" />
                  </div>
                </Link>
              </li>
            );
          })}
          <li className="border-t border-line" />
        </ul>
      </PageMain>
    </PageShell>
  );
}
