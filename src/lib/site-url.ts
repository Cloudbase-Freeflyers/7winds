/** Ensure a site URL always has a scheme; force https off localhost. */
export function normalizeSiteUrl(raw: string): string {
  let url = raw.trim().replace(/\/$/, "");
  if (!url) url = "https://7windsparagliding.com";
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

/** Canonical site URL from env (may differ from the host the user is browsing). */
export function getConfiguredSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://7windsparagliding.com";
  return normalizeSiteUrl(raw);
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
