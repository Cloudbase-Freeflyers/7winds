import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { affiliateBannerHtml } from "@/lib/affiliate-marketing";
import { getAffiliateById, affiliateUrl } from "@/lib/affiliates";

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

    const url = affiliateUrl(affiliate.code);
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: { dark: "#021929", light: "#ffffff" },
    });

    const html = affiliateBannerHtml({
      name: affiliate.name,
      code: affiliate.code,
      url,
      qrDataUrl,
    });

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[admin/affiliates/banner]", err);
    return NextResponse.json(
      { ok: false, error: "Banner generation failed" },
      { status: 500 }
    );
  }
}
