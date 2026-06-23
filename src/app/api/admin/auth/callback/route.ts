import { NextResponse } from "next/server";
import {
  adminSessionCookieOptions,
  createAdminSessionToken,
} from "@/lib/admin-session";
import {
  exchangeAdminAuthCode,
  isEmailAllowedForAdmin,
  verifyAdminOAuthState,
} from "@/lib/admin-oauth";
import { getSiteOrigin } from "@/lib/site-url";

export const runtime = "nodejs";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/admin")) return "/admin";
  return next;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const next = safeNextPath(searchParams.get("next"));
  const origin = getSiteOrigin(req);
  const loginUrl = `${origin}/admin/login`;

  if (error) {
    return NextResponse.redirect(`${loginUrl}?error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${loginUrl}?error=invalid_oauth`);
  }

  const verified = verifyAdminOAuthState(state);
  if (!verified.valid) {
    return NextResponse.redirect(`${loginUrl}?error=invalid_oauth`);
  }

  const redirectNext = verified.next || next;

  try {
    const redirectUri = `${origin}/api/admin/auth/callback`;
    const email = await exchangeAdminAuthCode(code, redirectUri);
    if (!isEmailAllowedForAdmin(email)) {
      return NextResponse.redirect(`${loginUrl}?error=not_allowed`);
    }

    const token = await createAdminSessionToken(email);
    const res = NextResponse.redirect(`${origin}${redirectNext}`);
    res.cookies.set("7winds_admin_session", token, adminSessionCookieOptions());
    return res;
  } catch (err) {
    console.error("[admin/auth/callback]", err);
    const msg = err instanceof Error ? err.message : "oauth_failed";
    return NextResponse.redirect(`${loginUrl}?error=${encodeURIComponent(msg)}`);
  }
}
