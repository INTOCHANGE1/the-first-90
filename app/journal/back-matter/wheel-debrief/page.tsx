import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import {
  POST_90_WHEEL_DEBRIEF,
  type Post90DebriefShape,
} from "@/lib/content/back-matter";
import { Post90DebriefClient } from "./Post90DebriefClient";

export default async function Post90DebriefPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("wheel_entries")
    .select("debrief")
    .eq("user_id", user.id)
    .eq("moment", "post_90")
    .maybeSingle();

  const debrief =
    (entry?.debrief as Post90DebriefShape | null | undefined) ?? {};

  return (
    <PageShell>
      <PageHeader backHref="/journal/back-matter" />
      <PageMain>
        <MicroLabel>{POST_90_WHEEL_DEBRIEF.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {POST_90_WHEEL_DEBRIEF.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {POST_90_WHEEL_DEBRIEF.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
        </div>
        <Post90DebriefClient initial={debrief} />
      </PageMain>
    </PageShell>
  );
}
