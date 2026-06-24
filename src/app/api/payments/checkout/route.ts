import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { resolveAffiliate } from "@/lib/affiliates";
import { logActivity } from "@/lib/activity-log";
import {
  calculateBookingPrice,
  formatBookingDescription,
} from "@/lib/booking-pricing";
import { PACKAGE_LABELS } from "@/lib/constants";
import { notifyAsync, notifyNewVoucher } from "@/lib/email";
import { buildCheckoutRedirectUrl } from "@/lib/icount";
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

  if (!process.env.ICOUNT_PAYPAGE_URL?.trim()) {
    console.error("[payments/checkout] ICOUNT_PAYPAGE_URL is not configured");
    return NextResponse.json(
      { ok: false, error: "תשלום לא זמין כרגע. נסו שוב מאוחר יותר." },
      { status: 503 }
    );
  }

  try {
    const affiliateCode = parsed.data.affiliateCode || undefined;
    const affiliate = await resolveAffiliate(affiliateCode);
    const orderId = randomUUID();
    const flightCount = parsed.data.flightCount;
    const pricing = calculateBookingPrice(parsed.data.package, flightCount);
    const amount = pricing.total;
    const description = formatBookingDescription(
      parsed.data.package,
      pricing.flightCount,
      pricing.total
    );
    const bookingAudience = pricing.bookingAudience;

    const redirectUrl = buildCheckoutRedirectUrl({
      orderId,
      amount,
      description,
      buyerName: parsed.data.buyerName,
      buyerPhone: normalizePhone(parsed.data.buyerPhone),
      buyerEmail: parsed.data.buyerEmail,
      affiliateCode: affiliate?.code,
      orderType: parsed.data.type,
      bookingAudience,
      flightCount: pricing.flightCount,
    });

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
      bookingAudience,
      flightCount: pricing.flightCount,
      videoDiscount: pricing.videoDiscount || undefined,
      percentDiscount: pricing.percentDiscount || undefined,
      percentRate: pricing.percentRate || undefined,
      amount,
      paymentStatus: "pending",
      status: "new",
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

    const isDirect = doc.orderType === "direct";
    notifyAsync(async () => {
      await logActivity({
        type: "voucher",
        title: `${isDirect ? "הזמנה חדשה" : "בקשת שובר"} — ${doc.buyerName}`,
        detail: [
          `חבילה: ${PACKAGE_LABELS[doc.package] ?? doc.package}`,
          typeof doc.amount === "number" ? `₪${doc.amount}` : null,
          "ממתין לתשלום",
          doc.affiliateCode ? `שותף: ${doc.affiliateCode}` : null,
        ]
          .filter(Boolean)
          .join(" · "),
      });
      await notifyNewVoucher({ ...doc, _id: result.insertedId });
    });

    return NextResponse.json({ ok: true, orderId, redirectUrl, id: result.insertedId.toString() });
  } catch (err) {
    console.error("[payments/checkout]", err);
    return NextResponse.json(
      { ok: false, error: "שמירה נכשלה. נסו שוב." },
      { status: 500 }
    );
  }
}
