import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { getRequestOriginFromNextRequest } from "@/lib/site-url";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

const PUBLIC_PATHS = [
  "/admin/login",
  "/api/admin/auth/google",
  "/api/admin/auth/callback",
  "/api/admin/auth/password",
  "/api/admin/auth/logout",
];

function isPublicAdminPath(path: string): boolean {
  return PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

function isAdminOAuthEnabled(): boolean {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const allowed = process.env.ADMIN_ALLOWED_EMAILS?.trim();
  return Boolean(clientId && allowed);
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (isPublicAdminPath(path)) {
    return NextResponse.next();
  }

  const session = await verifyAdminSessionToken(
    req.cookies.get(ADMIN_SESSION_COOKIE)?.value
  );
  if (session) {
    return NextResponse.next();
  }

  if (path.startsWith("/api/admin/")) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const origin = getRequestOriginFromNextRequest(req);
  const login = new URL("/admin/login", `${origin}/`);
  if (path !== "/admin/login") {
    login.searchParams.set("next", path);
  }
  return NextResponse.redirect(login);
}
