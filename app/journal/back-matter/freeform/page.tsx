import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { FREEFORM } from "@/lib/content/back-matter";
import { NewEntryButton } from "./NewEntryButton";

export default async function FreeformIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entries } = await supabase
    .from("freeform_entries")
    .select("id, title, content, updated_at")
    .eq("user_id", user.id)
    .neq("title", "__dev_autosave_test__") // hide the dev showcase row
    .order("updated_at", { ascending: false });

  return (
    <PageShell>
      <PageHeader backHref="/journal/back-matter" />
      <PageMain>
        <MicroLabel>{FREEFORM.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-4">
          {FREEFORM.title}
        </h1>
        <p className="text-base text-steel mb-8">{FREEFORM.intro}</p>

        <div className="mb-10">
          <NewEntryButton />
        </div>

        {(entries?.length ?? 0) === 0 ? (
          <p className="text-sm text-ash italic">
            Nothing yet. The page is yours.
          </p>
        ) : (
          <ul className="flex flex-col">
            {entries?.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/journal/back-matter/freeform/${e.id}`}
                  className="flex items-center justify-between py-5 border-t border-line group hover:bg-bone-warm/40 -mx-4 md:-mx-6 px-4 md:px-6 transition-colors"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-base text-ink truncate">
                      {e.title?.trim() ||
                        excerpt(e.content) ||
                        "Untitled entry"}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.12em] text-ash">
                      {formatDate(e.updated_at)}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ash group-hover:text-ink shrink-0" />
                </Link>
              </li>
            ))}
            <li className="border-t border-line" />
          </ul>
        )}
      </PageMain>
    </PageShell>
  );
}

function excerpt(content: string | null | undefined): string {
  if (!content) return "";
  const trimmed = content.trim().split(/\r?\n/)[0]?.trim() ?? "";
  return trimmed.length > 60 ? `${trimmed.slice(0, 60)}…` : trimmed;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
