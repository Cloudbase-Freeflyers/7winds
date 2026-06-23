import { NextResponse } from "next/server";
import {
  getConnectedEmailSender,
  saveConnectedEmailSender,
} from "@/lib/email-sender";
import {
  exchangeCodeForTokens,
  fetchGoogleEmail,
  isGoogleOAuthConfigured,
  verifyOAuthState,
} from "@/lib/gmail-oauth";
import { getOAuthSiteOrigin } from "@/lib/site-url";

export const runtime = "nodejs";

function resultUrl(origin: string, params: Record<string, string>) {
  const qs = new URLSearchParams(params);
  return `${origin}/gmail-connected?${qs.toString()}`;
}

export async function GET(req: Request) {
  const origin = getOAuthSiteOrigin(req);
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(resultUrl(origin, { error }));
  }

  if (!code || !state || !verifyOAuthState(state, "gmail").valid) {
    return NextResponse.redirect(resultUrl(origin, { error: "invalid_oauth" }));
  }

  if (!isGoogleOAuthConfigured()) {
    return NextResponse.redirect(resultUrl(origin, { error: "oauth_not_configured" }));
  }

  try {
    const tokens = await exchangeCodeForTokens(code, origin);
    const email = await fetchGoogleEmail(tokens.access_token!);
    const existing = await getConnectedEmailSender();
    const refreshToken = tokens.refresh_token ?? existing?.refreshToken;

    if (!refreshToken) {
      return NextResponse.redirect(
        resultUrl(origin, {
          error:
            "google_no_refresh_token — נסו 'חיבור מחדש' או בטלו גישה לאפליקציה בחשבון Google",
        })
      );
    }

    await saveConnectedEmailSender({
      senderEmail: email,
      refreshToken,
    });
    return NextResponse.redirect(resultUrl(origin, { connected: "1", email }));
  } catch (err) {
    console.error("[email/oauth/callback]", err);
    const msg = err instanceof Error ? err.message : "oauth_failed";
    return NextResponse.redirect(resultUrl(origin, { error: msg }));
  }
}
