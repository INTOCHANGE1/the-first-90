import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function JournalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, current_day, current_phase, invite_code_used")
    .eq("id", user.id)
    .single();

  if (!profile?.invite_code_used) redirect("/signup");

  const name = profile?.display_name?.split(" ")[0] ?? "friend";
  const day = profile?.current_day ?? 1;

  return (
    <main className="flex flex-1 flex-col px-6 py-16 max-w-[720px] w-full mx-auto">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash mb-3">
        PHASE {profile?.current_phase ?? 1} · DAY {day} / 90
      </p>
      <h1 className="font-serif italic text-4xl md:text-5xl text-ink mb-10">
        Morning, {name}.
      </h1>
      <p className="text-base text-steel mb-12">
        The journal proper goes here. For now this proves you&rsquo;re signed
        in, your profile loaded, and your code redeemed.
      </p>
      <a
        href="/settings"
        className="text-sm text-ink underline underline-offset-4 self-start"
      >
        Settings
      </a>
    </main>
  );
}
