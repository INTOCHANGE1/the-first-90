import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InviteCodeForm } from "./InviteCodeForm";

type SearchParams = Promise<{ error?: string }>;

export default async function SignupPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("invite_code_used")
      .eq("id", user.id)
      .single();
    if (profile?.invite_code_used) redirect("/journal");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash mb-6">
        THE NEW AGE MAN
      </p>
      <h1 className="font-serif italic text-4xl md:text-5xl text-ink text-center leading-tight mb-3">
        The First 90
      </h1>
      <p className="text-base text-steel mb-10 max-w-sm text-center">
        Your code came with the program. Enter it to begin.
      </p>
      <InviteCodeForm />
      {error === "redeem_failed" && (
        <p className="mt-6 text-sm text-blood">
          That code couldn&rsquo;t be claimed. It may have expired or already
          been used.
        </p>
      )}
      <p className="mt-12 text-sm text-steel">
        Already started?{" "}
        <a href="/login" className="text-ink underline underline-offset-4">
          Sign in
        </a>
        .
      </p>
    </main>
  );
}
