import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";
import { cookies } from "next/headers";

export const AFFILIATE_SESSION_COOKIE = "affiliate_session";
const SESSION_DAYS = 30;

function sessionSecret(): string {
  return (
    process.env.AFFILIATE_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "dev-affiliate-secret-change-me"
  );
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  try {
    const hashBuf = Buffer.from(hash, "hex");
    const testBuf = scryptSync(password, salt, 64);
    return timingSafeEqual(hashBuf, testBuf);
  } catch {
    return false;
  }
}

export function createSessionToken(affiliateId: string): string {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${affiliateId}.${exp}`;
  const sig = createHmac("sha256", sessionSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [affiliateId, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!affiliateId || !exp || Number.isNaN(exp) || Date.now() > exp) return null;

  const payload = `${affiliateId}.${expStr}`;
  const expected = createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("hex");

  try {
    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return null;
  } catch {
    return null;
  }

  return affiliateId;
}

export function sessionCookieOptions(maxAgeSeconds = SESSION_DAYS * 24 * 60 * 60) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export async function getSessionAffiliateId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AFFILIATE_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function getSessionAffiliateIdFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const match = cookieHeader.match(
    new RegExp(`(?:^|; )${AFFILIATE_SESSION_COOKIE}=([^;]+)`)
  );
  if (!match) return null;

  const token = decodeURIComponent(match[1]);
  return verifySessionToken(token);
}
