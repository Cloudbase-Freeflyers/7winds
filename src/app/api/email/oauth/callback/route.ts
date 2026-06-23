import { NextResponse } from "next/server";
import { saveConnectedEmailSender } from "@/lib/email-sender";
import {
  exchangeCodeForTokens,
  fetchGoogleEmail,
  isGoogleOAuthConfigured,
  verifyOAuthState,
} from "@/lib/gmail-oauth";
import { BRAND } from "@/lib/constants";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const adminUrl = `${BRAND.url.replace(/\/$/, "")}/admin/notifications`;

  if (error) {
    return NextResponse.redirect(`${adminUrl}?error=${encodeURIComponent(error)}`);
  }

  if (!code || !state || !verifyOAuthState(state)) {
    return NextResponse.redirect(`${adminUrl}?error=invalid_oauth`);
  }

  if (!isGoogleOAuthConfigured()) {
    return NextResponse.redirect(`${adminUrl}?error=oauth_not_configured`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const email = await fetchGoogleEmail(tokens.access_token!);
    await saveConnectedEmailSender({
      senderEmail: email,
      refreshToken: tokens.refresh_token!,
    });
    return NextResponse.redirect(`${adminUrl}?connected=1`);
  } catch (err) {
    console.error("[email/oauth/callback]", err);
    const msg = err instanceof Error ? err.message : "oauth_failed";
    return NextResponse.redirect(`${adminUrl}?error=${encodeURIComponent(msg)}`);
  }
}
