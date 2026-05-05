import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginButton } from "./LoginButton";

type SearchParams = Promise<{ next?: string; error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { next, error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next ?? "/journal");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash mb-6">
        THE NEW AGE MAN
      </p>
      <h1 className="font-serif italic text-4xl md:text-5xl text-ink text-center leading-tight mb-8">
        Welcome back
      </h1>
      <LoginButton next={next} />
      {error && (
        <p className="mt-6 text-sm text-blood">
          Something went wrong signing you in. Try again.
        </p>
      )}
      <p className="mt-12 text-sm text-steel">
        New here? You&rsquo;ll need an invite code to{" "}
        <a href="/signup" className="text-ink underline underline-offset-4">
          sign up
        </a>
        .
      </p>
    </main>
  );
}
