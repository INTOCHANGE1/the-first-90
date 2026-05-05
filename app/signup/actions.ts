"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const PENDING_CODE_COOKIE = "pending_invite_code";
const COOKIE_MAX_AGE = 60 * 15;

export type ValidateResult =
  | { ok: true; needsAuth: boolean }
  | { ok: false; reason: "empty" | "invalid" | "used" | "redeem_failed" };

function normaliseCode(input: string) {
  return input.trim().toUpperCase();
}

export async function validateInviteCode(
  rawCode: string,
): Promise<ValidateResult> {
  const code = normaliseCode(rawCode);
  if (!code) return { ok: false, reason: "empty" };

  const supabase = await createClient();

  // RLS on invite_codes only allows authenticated reads.
  // Pre-auth validation goes through a security-definer function that returns
  // a single boolean. The downstream redeem_invite_code() does the same
  // check atomically, so a true here is necessary but not sufficient.
  const { data: isValid, error: validateError } = await supabase.rpc(
    "validate_invite_code",
    { code_input: code },
  );

  if (validateError || !isValid) {
    return { ok: false, reason: "invalid" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const cookieStore = await cookies();
    cookieStore.set(PENDING_CODE_COOKIE, code, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
    return { ok: true, needsAuth: true };
  }

  const { data: redeemed } = await supabase.rpc("redeem_invite_code", {
    code_input: code,
  });
  if (!redeemed) return { ok: false, reason: "redeem_failed" };

  redirect("/journal");
}
