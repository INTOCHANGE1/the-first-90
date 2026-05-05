"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { validateInviteCode, type ValidateResult } from "./actions";

const REASON_COPY: Record<
  Exclude<ValidateResult & { ok: false }, never>["reason"],
  string
> = {
  empty: "Enter the code you were sent.",
  invalid: "This code isn't valid. Check with the team that issued it.",
  used: "This code has already been used.",
  redeem_failed: "Something went wrong claiming the code. Try again.",
};

export function InviteCodeForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    const value = String(formData.get("code") ?? "");
    startTransition(async () => {
      const result = await validateInviteCode(value);
      if (!result.ok) {
        setError(REASON_COPY[result.reason]);
        return;
      }
      const supabase = createClient();
      const redirectTo = new URL("/auth/callback", window.location.origin);
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectTo.toString() },
      });
      if (signInError) setError("Couldn't open Google sign-in. Try again.");
    });
  }

  return (
    <form action={onSubmit} className="w-full max-w-sm flex flex-col gap-4">
      <label
        htmlFor="code"
        className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash"
      >
        Invite code
      </label>
      <input
        id="code"
        name="code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="NAM-XXXXXX"
        autoComplete="off"
        spellCheck={false}
        className="w-full bg-bone-warm border border-line px-4 py-3 text-base text-ink rounded focus:outline-none focus:ring-2 focus:ring-blood focus:ring-offset-2 focus:ring-offset-bone"
      />
      {error && <p className="text-sm text-blood">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-blood text-bone px-6 py-3 text-xs font-medium uppercase tracking-[0.12em] rounded transition-colors hover:bg-blood-deep disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {pending ? "Checking…" : "Continue"}
      </button>
    </form>
  );
}
