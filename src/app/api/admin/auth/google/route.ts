import { NextResponse } from "next/server";
import {
  buildAdminLoginUrl,
  createAdminOAuthState,
  getAdminAuthRedirectUri,
  getAdminOAuthConfigIssue,
} from "@/lib/admin-oauth";
import { getSiteOrigin } from "@/lib/site-url";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const configIssue = getAdminOAuthConfigIssue();
  if (configIssue) {
    return NextResponse.json({ ok: false, error: configIssue }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const next = searchParams.get("next") || "/admin";
  const origin = getSiteOrigin(req);
  const redirectUri = getAdminAuthRedirectUri(origin);
  const state = createAdminOAuthState(next.startsWith("/admin") ? next : "/admin");
  return NextResponse.redirect(buildAdminLoginUrl(state, redirectUri));
}
