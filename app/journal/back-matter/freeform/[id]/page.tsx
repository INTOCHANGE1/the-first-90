import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { FreeformEditor } from "./FreeformEditor";

export default async function FreeformEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("freeform_entries")
    .select("id, title, content")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!entry) notFound();

  return (
    <PageShell>
      <PageHeader backHref="/journal/back-matter/freeform" />
      <PageMain>
        <MicroLabel>REFLECTION</MicroLabel>
        <h1 className="font-serif italic text-3xl md:text-4xl text-ink leading-tight mt-2 mb-8">
          {entry.title?.trim() || "Untitled entry"}
        </h1>
        <FreeformEditor
          id={entry.id}
          initial={{
            title: entry.title ?? "",
            content: entry.content ?? "",
          }}
        />
      </PageMain>
    </PageShell>
  );
}
