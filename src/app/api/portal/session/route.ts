import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { AFFILIATE_SESSION_COOKIE, verifySessionToken } from "@/lib/affiliate-auth";
import { getAffiliateById } from "@/lib/affiliates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();

  const adminToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const adminSession = await verifyAdminSessionToken(adminToken);

  const affiliateToken = cookieStore.get(AFFILIATE_SESSION_COOKIE)?.value;
  const affiliateId = affiliateToken
    ? verifySessionToken(affiliateToken)
    : null;

  let affiliateName: string | null = null;
  if (affiliateId) {
    try {
      const affiliate = await getAffiliateById(affiliateId);
      if (affiliate?.status === "active") {
        affiliateName = affiliate.name;
      }
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json({
    admin: adminSession
      ? { loggedIn: true, email: adminSession.email }
      : { loggedIn: false },
    affiliate: affiliateId && affiliateName
      ? { loggedIn: true, name: affiliateName }
      : { loggedIn: false },
  });
}
