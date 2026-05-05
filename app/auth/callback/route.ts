import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const PENDING_CODE_COOKIE = "pending_invite_code";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/journal";

  if (!code) {
    url.pathname = "/login";
    url.searchParams.set("error", "missing_code");
    return NextResponse.redirect(url);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    url.pathname = "/login";
    url.searchParams.set("error", "exchange_failed");
    return NextResponse.redirect(url);
  }

  const cookieStore = await cookies();
  const pendingCode = cookieStore.get(PENDING_CODE_COOKIE)?.value;

  if (pendingCode) {
    const { data: redeemed } = await supabase.rpc("redeem_invite_code", {
      code_input: pendingCode,
    });
    cookieStore.delete(PENDING_CODE_COOKIE);

    if (!redeemed) {
      url.pathname = "/signup";
      url.searchParams.set("error", "redeem_failed");
      return NextResponse.redirect(url);
    }
  } else {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("invite_code_used")
        .eq("id", user.id)
        .single();
      if (!profile?.invite_code_used) {
        url.pathname = "/signup";
        url.search = "";
        return NextResponse.redirect(url);
      }
    }
  }

  url.pathname = next;
  url.search = "";
  return NextResponse.redirect(url);
}
