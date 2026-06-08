import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import QRCode from "qrcode";
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
    console.error("[admin/affiliates/qr]", err);
    return NextResponse.json(
      { ok: false, error: "QR generation failed" },
      { status: 500 }
    );
  }
}
