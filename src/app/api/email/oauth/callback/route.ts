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

function resultUrl(params: Record<string, string>) {
  const base = `${BRAND.url.replace(/\/$/, "")}/gmail-connected`;
  const qs = new URLSearchParams(params);
  return `${base}?${qs.toString()}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(resultUrl({ error }));
  }

  if (!code || !state || !verifyOAuthState(state, "gmail").valid) {
    return NextResponse.redirect(resultUrl({ error: "invalid_oauth" }));
  }

  if (!isGoogleOAuthConfigured()) {
    return NextResponse.redirect(resultUrl({ error: "oauth_not_configured" }));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const email = await fetchGoogleEmail(tokens.access_token!);
    await saveConnectedEmailSender({
      senderEmail: email,
      refreshToken: tokens.refresh_token!,
    });
    return NextResponse.redirect(resultUrl({ connected: "1", email }));
  } catch (err) {
    console.error("[email/oauth/callback]", err);
    const msg = err instanceof Error ? err.message : "oauth_failed";
    return NextResponse.redirect(resultUrl({ error: msg }));
  }
}
