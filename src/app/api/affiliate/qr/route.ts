import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getAffiliateById, affiliateUrl } from "@/lib/affiliates";
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

    const url = affiliateUrl(affiliate.code);
    const png = await QRCode.toBuffer(url, {
      type: "png",
      width: 400,
      margin: 2,
      color: { dark: "#021929", light: "#ffffff" },
    });

    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[affiliate/qr]", err);
    return NextResponse.json(
      { ok: false, error: "QR generation failed" },
      { status: 500 }
    );
  }
}
