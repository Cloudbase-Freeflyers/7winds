import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { VoucherDoc } from "@/types/submissions";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const orderId = new URL(req.url).searchParams.get("order");
  if (!orderId) {
    return NextResponse.json(
      { ok: false, error: "Missing order id" },
      { status: 400 }
    );
  }

  try {
    const db = await getDb();
    const order = await db.collection<VoucherDoc>("vouchers").findOne({ orderId });

    if (!order) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      order: {
        id: order.orderId,
        paymentStatus: order.paymentStatus || null,
        package: order.package,
        amount: order.amount ?? null,
        orderType: order.orderType ?? null,
        buyerName: order.buyerName,
      },
    });
  } catch (err) {
    console.error("[payments/order]", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
