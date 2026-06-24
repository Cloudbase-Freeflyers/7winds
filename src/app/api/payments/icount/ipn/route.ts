import { NextResponse } from "next/server";
import { recordAffiliateEvent, resolveAffiliate } from "@/lib/affiliates";
import { logActivity } from "@/lib/activity-log";
import { notifyAsync, notifyVoucherPaid } from "@/lib/email";
import { parseIpnPayload } from "@/lib/icount";
import { getDb } from "@/lib/mongodb";
import { PACKAGE_LABELS } from "@/lib/constants";
import type { VoucherDoc } from "@/types/submissions";

export const runtime = "nodejs";

function findOrderId(data: Record<string, string>): string | null {
  return data.orderId || data.m__orderId || null;
}

export async function POST(req: Request) {
  let data: Record<string, string>;
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data = {};
      formData.forEach((value, key) => {
        data[key] = String(value);
      });
    } else if (contentType.includes("application/json")) {
      const json = (await req.json()) as Record<string, unknown>;
      data = Object.fromEntries(
        Object.entries(json).map(([k, v]) => [k, String(v ?? "")])
      );
    } else {
      const body = await req.text();
      data = parseIpnPayload(body);
    }
  } catch (err) {
    console.error("[payments/ipn] parse failed", err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const orderId = findOrderId(data);
  if (!orderId) {
    console.warn("[payments/ipn] missing orderId", data);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const db = await getDb();
    const collection = db.collection<VoucherDoc>("vouchers");
    const existing = await collection.findOne({ orderId });

    if (!existing) {
      console.warn("[payments/ipn] order not found", orderId);
      return NextResponse.json({ ok: false }, { status: 404 });
    }

    if (existing.paymentStatus === "paid") {
      return NextResponse.json({ ok: true });
    }

    const confirmationCode = data.confirmation_code || undefined;
    const docNumRaw = data.docnum;
    const docNum = docNumRaw ? Number(docNumRaw) : undefined;

    await collection.updateOne(
      { orderId },
      {
        $set: {
          paymentStatus: "paid",
          paidAt: new Date(),
          ...(confirmationCode ? { icountConfirmationCode: confirmationCode } : {}),
          ...(docNum && !Number.isNaN(docNum) ? { icountDocNum: docNum } : {}),
        },
      }
    );

    if (existing.affiliateCode) {
      const affiliate = await resolveAffiliate(existing.affiliateCode);
      if (affiliate) {
        await recordAffiliateEvent(affiliate, "voucher", {
          voucherId: String(existing._id),
          package: existing.package,
          paid: true,
        });
      }
    }

    const paidVoucher: VoucherDoc = {
      ...existing,
      paymentStatus: "paid",
      paidAt: new Date(),
      ...(confirmationCode ? { icountConfirmationCode: confirmationCode } : {}),
      ...(docNum && !Number.isNaN(docNum) ? { icountDocNum: docNum } : {}),
    };
    notifyAsync(async () => {
      await logActivity({
        type: "payment",
        title: `תשלום אושר — ${existing.buyerName}`,
        detail: [`חבילה: ${PACKAGE_LABELS[existing.package] ?? existing.package}`,
          typeof existing.amount === "number" ? `₪${existing.amount}` : null,
          `הזמנה: ${orderId}`].filter(Boolean).join(" · "),
      });
      await notifyVoucherPaid(paidVoucher);
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[payments/ipn]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
