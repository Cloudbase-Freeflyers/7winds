import { BRAND } from "@/lib/constants";

/** Canonical site URL from env (may differ from the host the user is browsing). */
export function getConfiguredSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || BRAND.url).replace(/\/$/, "");
}

/**
 * Origin of the incoming request — use for redirects so OAuth stays on the
 * domain the user actually opened (e.g. 7windsparagliding.com vs lp.*).
 */
export function getRequestOrigin(req: Request): string {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
  if (forwardedHost) {
    const host = forwardedHost.split(",")[0]?.trim();
    if (host) return `${forwardedProto}://${host}`;
  }
  return new URL(req.url).origin;
}
