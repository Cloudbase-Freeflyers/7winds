import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, adminSessionCookieOptions } from "@/lib/admin-session";
import { BRAND } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.redirect(`${BRAND.url.replace(/\/$/, "")}/admin/login`);
  res.cookies.set(ADMIN_SESSION_COOKIE, "", { ...adminSessionCookieOptions(0), maxAge: 0 });
  res.cookies.set("7winds_admin", "", { path: "/", maxAge: 0 });
  return res;
}
