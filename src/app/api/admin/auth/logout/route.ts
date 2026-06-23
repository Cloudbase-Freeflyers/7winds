import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, adminSessionCookieOptions } from "@/lib/admin-session";
import { getRequestOrigin } from "@/lib/site-url";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const origin = getRequestOrigin(req);
  const res = NextResponse.redirect(`${origin}/admin/login`);
  res.cookies.set(ADMIN_SESSION_COOKIE, "", { ...adminSessionCookieOptions(0), maxAge: 0 });
  res.cookies.set("7winds_admin", "", { path: "/", maxAge: 0 });
  return res;
}
