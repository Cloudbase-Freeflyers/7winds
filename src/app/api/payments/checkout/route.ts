import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { resolveAffiliate } from "@/lib/affiliates";
import {
  buildCheckoutRedirectUrl,
  getPackageDescription,
  getPackagePrice,
} from "@/lib/icount";
import { getDb } from "@/lib/mongodb";
import { checkoutSchema, normalizePhone } from "@/lib/validation";
import type { VoucherDoc } from "@/types/submissions";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "פרטי הטופס לא תקינים";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }

  try {
    const affiliateCode = parsed.data.affiliateCode || undefined;
    const affiliate = await resolveAffiliate(affiliateCode);
    const orderId = randomUUID();
    const amount = getPackagePrice(parsed.data.package);
    const description = getPackageDescription(parsed.data.package);

    const db = await getDb();
    const doc: VoucherDoc = {
      orderId,
      buyerName: parsed.data.buyerName,
      buyerPhone: normalizePhone(parsed.data.buyerPhone),
      buyerEmail: parsed.data.buyerEmail,
      recipientName: parsed.data.recipientName || undefined,
      occasion: parsed.data.occasion || undefined,
      package: parsed.data.package,
      notes: parsed.data.notes || undefined,
      orderType: parsed.data.type,
      amount,
      paymentStatus: "pending",
      createdAt: new Date(),
      ...(affiliate
        ? {
            affiliateId: String(affiliate._id),
            affiliateCode: affiliate.code,
          }
        : {}),
    };

    const result = await db.collection<VoucherDoc>("vouchers").insertOne(doc);
    await db
      .collection("vouchers")
      .createIndex({ orderId: 1 }, { unique: true, sparse: true });

    const redirectUrl = buildCheckoutRedirectUrl({
      orderId,
      amount,
      description,
      buyerName: parsed.data.buyerName,
      buyerPhone: normalizePhone(parsed.data.buyerPhone),
      buyerEmail: parsed.data.buyerEmail,
      affiliateCode: affiliate?.code,
      orderType: parsed.data.type,
    });

    return NextResponse.json({ ok: true, orderId, redirectUrl, id: result.insertedId.toString() });
  } catch (err) {
    console.error("[payments/checkout]", err);
    const message =
      err instanceof Error && err.message.includes("ICOUNT_PAYPAGE_URL")
        ? "תשלום לא זמין כרגע. נסו שוב מאוחר יותר."
        : "שמירה נכשלה. נסו שוב.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
