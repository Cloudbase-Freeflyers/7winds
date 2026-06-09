import { NextResponse } from "next/server";
import { getAffiliateByEmail } from "@/lib/affiliates";
import {
  AFFILIATE_SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/affiliate-auth";
import { affiliateLoginSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = affiliateLoginSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "פרטים לא תקינים";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }

  try {
    const affiliate = await getAffiliateByEmail(parsed.data.email);
    if (
      !affiliate?._id ||
      !affiliate.passwordHash ||
      affiliate.status !== "active"
    ) {
      return NextResponse.json(
        { ok: false, error: "אימייל או סיסמה שגויים" },
        { status: 401 }
      );
    }

    if (!verifyPassword(parsed.data.password, affiliate.passwordHash)) {
      return NextResponse.json(
        { ok: false, error: "אימייל או סיסמה שגויים" },
        { status: 401 }
      );
    }

    const token = createSessionToken(String(affiliate._id));
    const res = NextResponse.json({ ok: true });
    res.cookies.set(
      AFFILIATE_SESSION_COOKIE,
      token,
      sessionCookieOptions()
    );
    return res;
  } catch (err) {
    console.error("[affiliate/login]", err);
    return NextResponse.json(
      { ok: false, error: "התחברות נכשלה. נסו שוב." },
      { status: 500 }
    );
  }
}
