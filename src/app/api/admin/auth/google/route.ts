import { NextResponse } from "next/server";
import {
  buildAdminLoginUrl,
  createAdminOAuthState,
  getAdminOAuthConfigIssue,
} from "@/lib/admin-oauth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const configIssue = getAdminOAuthConfigIssue();
  if (configIssue) {
    return NextResponse.json({ ok: false, error: configIssue }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const next = searchParams.get("next") || "/admin";
  const state = createAdminOAuthState(next.startsWith("/admin") ? next : "/admin");
  return NextResponse.redirect(buildAdminLoginUrl(state));
}
