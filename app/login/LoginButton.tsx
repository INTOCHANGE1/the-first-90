"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginButton({ next }: { next?: string }) {
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const supabase = createClient();
    const redirectTo = new URL("/auth/callback", window.location.origin);
    if (next) redirectTo.searchParams.set("next", next);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo.toString() },
    });

    if (error) setLoading(false);
  }

  return (
    <button
      onClick={signIn}
      disabled={loading}
      className="bg-blood text-bone px-6 py-3 text-xs font-medium uppercase tracking-[0.12em] rounded transition-colors hover:bg-blood-deep disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {loading ? "Signing in…" : "Sign in with Google"}
    </button>
  );
}
