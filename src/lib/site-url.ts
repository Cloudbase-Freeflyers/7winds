/** Ensure a site URL always has a scheme; force https off localhost. */
export function normalizeSiteUrl(raw: string): string {
  let url = raw.trim().replace(/\/$/, "");
  if (!url) url = "https://lp.7windsparagliding.com";
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    const isLocal =
      parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (!isLocal && parsed.protocol === "http:") {
      parsed.protocol = "https:";
    }
    return parsed.origin;
  } catch {
    return url.startsWith("http") ? url : `https://${url}`;
  }
}

function isLocalHost(host: string): boolean {
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

function originFromHost(
  host: string,
  forwardedProto: string | null,
  fallbackProtocol?: string
): string {
  if (isLocalHost(host)) {
    const proto =
      forwardedProto?.split(",")[0]?.trim() ||
      fallbackProtocol?.replace(":", "") ||
      "http";
    return `${proto}://${host}`;
  }
  return `https://${host}`;
}

/** Canonical site URL from env — production uses the lp subdomain only. */
export function getConfiguredSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://lp.7windsparagliding.com";
  return normalizeSiteUrl(raw);
}

function isLocalOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

/**
 * Origin to use for the OAuth `redirect_uri` (and the page the user lands on
 * after login). This MUST match a redirect URI registered in Google Cloud
 * Console, so it is pinned to the canonical configured origin regardless of
 * which host the admin page was opened on (apex, www, lp, …). Without this,
 * opening admin on a non-registered host triggers redirect_uri_mismatch.
 *
 * In local dev it follows the request (localhost) so you don't have to register
 * a separate URI per port.
 */
export function getOAuthSiteOrigin(req?: Request): string {
  if (req) {
    const origin = getRequestOrigin(req);
    if (isLocalOrigin(origin)) return origin;
  }
  return getConfiguredSiteUrl();
}

/**
 * Origin for plain browse redirects (login page, error bounces) — stays on the
 * host the user actually opened. Falls back to the configured URL when no
 * request is available.
 */
export function getSiteOrigin(req?: Request): string {
  if (req) return getRequestOrigin(req);
  return getConfiguredSiteUrl();
}

/**
 * Origin of the incoming request — use for redirects so OAuth stays on the
 * domain the user actually opened (always https in production).
 */
export function getRequestOrigin(req: Request): string {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    const host = forwardedHost.split(",")[0]?.trim();
    if (host) return originFromHost(host, forwardedProto);
  }

  const url = new URL(req.url);
  return originFromHost(url.host, forwardedProto, url.protocol);
}

/** Same as getRequestOrigin but for Next.js middleware (NextRequest). */
export function getRequestOriginFromNextRequest(req: {
  headers: { get(name: string): string | null };
  nextUrl: { host: string; protocol: string };
}): string {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const host =
    forwardedHost?.split(",")[0]?.trim() || req.nextUrl.host;
  return originFromHost(host, forwardedProto, req.nextUrl.protocol);
}
