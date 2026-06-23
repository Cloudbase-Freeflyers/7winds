import { BRAND } from "@/lib/constants";
import {
  createOAuthState,
  fetchGoogleEmail,
  getGoogleOAuthCredentials,
  verifyOAuthState,
} from "@/lib/gmail-oauth";

const ADMIN_SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export function getAllowedAdminEmails(): string[] {
  const raw = process.env.ADMIN_ALLOWED_EMAILS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminOAuthEnabled(): boolean {
  return Boolean(
    getGoogleOAuthCredentials() && getAllowedAdminEmails().length > 0
  );
}

export function isEmailAllowedForAdmin(email: string): boolean {
  const allowed = getAllowedAdminEmails();
  return allowed.includes(email.trim().toLowerCase());
}

export function getAdminAuthRedirectUri(): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || BRAND.url).replace(/\/$/, "");
  return `${base}/api/admin/auth/callback`;
}

export function buildAdminLoginUrl(state: string): string {
  const creds = getGoogleOAuthCredentials();
  if (!creds) throw new Error("Google OAuth is not configured");

  const params = new URLSearchParams({
    client_id: creds.clientId,
    redirect_uri: getAdminAuthRedirectUri(),
    response_type: "code",
    scope: ADMIN_SCOPES.join(" "),
    state,
    prompt: "select_account",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function createAdminOAuthState(next?: string): string {
  return createOAuthState("admin", next);
}

export function verifyAdminOAuthState(state: string): { valid: boolean; next?: string } {
  return verifyOAuthState(state, "admin");
}

export async function exchangeAdminAuthCode(code: string) {
  const creds = getGoogleOAuthCredentials();
  if (!creds) throw new Error("Google OAuth is not configured");

  const body = new URLSearchParams({
    code,
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    redirect_uri: getAdminAuthRedirectUri(),
    grant_type: "authorization_code",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = (await res.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Token exchange failed");
  }

  const email = await fetchGoogleEmail(data.access_token);
  return email;
}
