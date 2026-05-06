import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PageShell,
  PageHeader,
  PageMain,
} from "@/components/ui/PageShell";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { POST_90_WHEEL } from "@/lib/content/back-matter";
import type { WheelRatings } from "@/lib/wheel";
import { Post90WheelClient } from "./Post90WheelClient";

export default async function Post90WheelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entry } = await supabase
    .from("wheel_entries")
    .select("ratings")
    .eq("user_id", user.id)
    .eq("moment", "post_90")
    .maybeSingle();

  const ratings = (entry?.ratings as WheelRatings | null | undefined) ?? {};

  return (
    <PageShell>
      <PageHeader backHref="/journal/back-matter" />
      <PageMain>
        <MicroLabel>{POST_90_WHEEL.preTitle}</MicroLabel>
        <h1 className="font-serif italic text-4xl md:text-5xl text-ink leading-tight mt-2 mb-8">
          {POST_90_WHEEL.title}
        </h1>
        <div className="flex flex-col gap-4 mb-8">
          {POST_90_WHEEL.intro.map((p, i) => (
            <p key={i} className="text-ink">
              {p}
            </p>
          ))}
          <p className="text-sm text-ash">{POST_90_WHEEL.hint}</p>
        </div>
        <Post90WheelClient initialRatings={ratings} />
      </PageMain>
    </PageShell>
  );
}
