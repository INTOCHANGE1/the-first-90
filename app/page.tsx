import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/journal");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash mb-6">
        THE NEW AGE MAN
      </p>
      <h1 className="font-serif italic text-5xl md:text-6xl text-ink text-center leading-tight">
        The First 90
      </h1>
      <span
        aria-hidden
        className="mt-8 block h-px w-16 bg-blood"
      />
      <p className="mt-8 max-w-md text-center text-base text-steel">
        A 12-week journal for the man who has decided to stop drifting.
      </p>

      <div className="mt-12 flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
        <Button>
          <Link href="/signup">Have a code? Begin</Link>
        </Button>
        <Button variant="secondary">
          <Link href="/login">Already started? Sign in</Link>
        </Button>
      </div>

      <p className="mt-12 text-center text-xs text-ash">
        By using The First 90 you agree to our{" "}
        <Link
          href="/terms"
          className="text-steel underline underline-offset-4"
        >
          terms
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-steel underline underline-offset-4"
        >
          privacy policy
        </Link>
        .
      </p>
    </main>
  );
}
