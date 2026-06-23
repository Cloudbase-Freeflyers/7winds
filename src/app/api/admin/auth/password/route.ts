import { NextResponse } from "next/server";
import {
  adminSessionCookieOptions,
  createAdminSessionToken,
} from "@/lib/admin-session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) {
    return NextResponse.json({ ok: false, error: "Password login disabled" }, { status: 503 });
  }

  let body: { password?: string; next?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (body.password !== expected) {
    return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 });
  }

  const next =
    body.next && body.next.startsWith("/admin") ? body.next : "/admin";
  const token = await createAdminSessionToken("admin@password");
  const res = NextResponse.json({ ok: true, next });
  res.cookies.set("7winds_admin_session", token, adminSessionCookieOptions());
  return res;
}
