import { NextResponse, type NextRequest } from "next/server";
import { refreshSession } from "@/lib/supabase/proxy";

const PROTECTED_PREFIXES = ["/journal", "/settings", "/onboarding", "/reset"];

const SUPABASE_AUTH_COOKIE_PREFIX = "sb-";

export async function proxy(request: NextRequest) {
  const { response, user } = await refreshSession(request);
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !user) {
    // Distinguish "never signed in" from "session expired" by checking whether
    // any Supabase auth cookie was sent at all. If yes → expired. If no →
    // user just isn't authed.
    const hadSupabaseCookie = request.cookies
      .getAll()
      .some((c) => c.name.startsWith(SUPABASE_AUTH_COOKIE_PREFIX));

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    if (hadSupabaseCookie) url.searchParams.set("error", "expired");
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
