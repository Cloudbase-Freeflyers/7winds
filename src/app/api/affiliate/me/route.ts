import { NextResponse } from "next/server";
import {
  getAffiliateById,
  getAffiliateStats,
  affiliateUrl,
} from "@/lib/affiliates";
import { getSessionAffiliateIdFromRequest } from "@/lib/affiliate-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const affiliateId = getSessionAffiliateIdFromRequest(req);
  if (!affiliateId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const affiliate = await getAffiliateById(affiliateId);
    if (!affiliate?._id || affiliate.status !== "active") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getAffiliateStats(affiliateId);
    return NextResponse.json({
      ok: true,
      affiliate: {
        id: String(affiliate._id),
        code: affiliate.code,
        name: affiliate.name,
        email: affiliate.email,
        commissionRate: affiliate.commissionRate,
        commissionType: affiliate.commissionType,
        payoutStatus: affiliate.payoutStatus,
        totalPaid: affiliate.totalPaid,
        url: affiliateUrl(affiliate.code),
      },
      stats,
    });
  } catch (err) {
    console.error("[affiliate/me]", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
