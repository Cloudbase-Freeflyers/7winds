import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getAffiliateById, getAffiliateStats, affiliateUrl } from "@/lib/affiliates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }

  try {
    const affiliate = await getAffiliateById(id);
    if (!affiliate) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    const stats = await getAffiliateStats(id);
    return NextResponse.json({
      ok: true,
      affiliate: {
        ...affiliate,
        _id: String(affiliate._id),
        url: affiliateUrl(affiliate.code),
      },
      stats,
    });
  } catch (err) {
    console.error("[admin/affiliates/stats]", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load stats" },
      { status: 500 }
    );
  }
}
