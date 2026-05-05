import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, email, timezone")
    .eq("id", user.id)
    .single();

  return (
    <main className="flex flex-1 flex-col px-6 py-16 max-w-[720px] w-full mx-auto">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash mb-3">
        SETTINGS
      </p>
      <h1 className="font-serif italic text-4xl md:text-5xl text-ink mb-10">
        Yours
      </h1>

      <dl className="grid grid-cols-[8rem_1fr] gap-y-4 mb-12 text-sm">
        <dt className="text-ash uppercase tracking-[0.08em] text-xs">Name</dt>
        <dd className="text-ink">{profile?.display_name ?? "—"}</dd>
        <dt className="text-ash uppercase tracking-[0.08em] text-xs">Email</dt>
        <dd className="text-ink">{profile?.email ?? user.email}</dd>
        <dt className="text-ash uppercase tracking-[0.08em] text-xs">
          Timezone
        </dt>
        <dd className="text-ink">{profile?.timezone ?? "UTC"}</dd>
      </dl>

      <SignOutButton />

      <a
        href="/journal"
        className="mt-12 text-sm text-ink underline underline-offset-4 self-start"
      >
        Back to journal
      </a>
    </main>
  );
}
