import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { voucherSchema, normalizePhone } from "@/lib/validation";
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

  const parsed = voucherSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "פרטי הטופס לא תקינים";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }

  try {
    const db = await getDb();
    const doc: VoucherDoc = {
      buyerName: parsed.data.buyerName,
      buyerPhone: normalizePhone(parsed.data.buyerPhone),
      recipientName: parsed.data.recipientName || undefined,
      occasion: parsed.data.occasion || undefined,
      package: parsed.data.package,
      notes: parsed.data.notes || undefined,
      createdAt: new Date(),
    };
    const result = await db.collection<VoucherDoc>("vouchers").insertOne(doc);
    return NextResponse.json({ ok: true, id: result.insertedId.toString() });
  } catch (err) {
    console.error("[vouchers] insert failed", err);
    return NextResponse.json(
      { ok: false, error: "שמירה נכשלה. נסו שוב." },
      { status: 500 }
    );
  }
}
