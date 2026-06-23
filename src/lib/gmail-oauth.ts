import crypto from "crypto";
import { BRAND } from "@/lib/constants";

export const GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send";
const EMAIL_SCOPE = "https://www.googleapis.com/auth/userinfo.email";

export function getGoogleOAuthCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(getGoogleOAuthCredentials());
}

export function getOAuthRedirectUri(): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || BRAND.url).replace(/\/$/, "");
  return `${base}/api/email/oauth/callback`;
}

function oauthStateSecret(): string {
  return (
    process.env.AFFILIATE_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    "7winds-email-oauth"
  );
}

export function createOAuthState(): string {
  const payload = Buffer.from(
    JSON.stringify({ ts: Date.now(), n: crypto.randomBytes(8).toString("hex") })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", oauthStateSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyOAuthState(state: string): boolean {
  const [payload, sig] = state.split(".");
  if (!payload || !sig) return false;
  const expected = crypto
    .createHmac("sha256", oauthStateSecret())
    .update(payload)
    .digest("base64url");
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return false;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      ts?: number;
    };
    if (!data.ts || Date.now() - data.ts > 15 * 60 * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export function buildGoogleAuthUrl(state: string): string {
  const creds = getGoogleOAuthCredentials();
  if (!creds) throw new Error("Google OAuth is not configured");

  const params = new URLSearchParams({
    client_id: creds.clientId,
    redirect_uri: getOAuthRedirectUri(),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: [GMAIL_SEND_SCOPE, EMAIL_SCOPE].join(" "),
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string) {
  const creds = getGoogleOAuthCredentials();
  if (!creds) throw new Error("Google OAuth is not configured");

  const body = new URLSearchParams({
    code,
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    redirect_uri: getOAuthRedirectUri(),
    grant_type: "authorization_code",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = (await res.json()) as {
    refresh_token?: string;
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!res.ok || !data.refresh_token) {
    throw new Error(data.error_description || data.error || "Token exchange failed");
  }

  return data;
}

export async function fetchGoogleEmail(accessToken: string): Promise<string> {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = (await res.json()) as { email?: string };
  if (!res.ok || !data.email) {
    throw new Error("Could not read Google account email");
  }
  return data.email.toLowerCase();
}
