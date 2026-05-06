import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { INTEGRITY_INVENTORY } from "@/lib/content/phase-1";
import { IntegrityClient } from "./IntegrityClient";

export default async function IntegrityInventoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("integrity_inventory_entries")
    .select(
      "broken_to_self, broken_to_partner, broken_to_children, broken_to_work, reflection",
    )
    .eq("user_id", user.id)
    .maybeSingle();

  const initial = {
    broken_to_self: entry?.broken_to_self ?? "",
    broken_to_partner: entry?.broken_to_partner ?? "",
    broken_to_children: entry?.broken_to_children ?? "",
    broken_to_work: entry?.broken_to_work ?? "",
    reflection: entry?.reflection ?? "",
  };

  return (
    <PageShell>
      <PageHeader backHref="/journal/phase/1" />
      <PageMain>
        <MicroLabel>{INTEGRITY_INVENTORY.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {INTEGRITY_INVENTORY.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {INTEGRITY_INVENTORY.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>
        <IntegrityClient initial={initial} />
      </PageMain>
    </PageShell>
  );
}
