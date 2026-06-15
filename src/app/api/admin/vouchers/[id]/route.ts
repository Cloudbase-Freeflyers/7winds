import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { adminVoucherUpdateSchema, normalizePhone } from "@/lib/validation";
import type { VoucherDoc } from "@/types/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = adminVoucherUpdateSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "פרטים לא תקינים";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }

  const updates: Partial<VoucherDoc> = { updatedAt: new Date() };
  if (parsed.data.buyerName !== undefined) updates.buyerName = parsed.data.buyerName;
  if (parsed.data.buyerPhone !== undefined)
    updates.buyerPhone = normalizePhone(parsed.data.buyerPhone);
  if (parsed.data.buyerEmail !== undefined)
    updates.buyerEmail = parsed.data.buyerEmail || undefined;
  if (parsed.data.recipientName !== undefined)
    updates.recipientName = parsed.data.recipientName || undefined;
  if (parsed.data.occasion !== undefined)
    updates.occasion = parsed.data.occasion || undefined;
  if (parsed.data.package !== undefined) updates.package = parsed.data.package;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes || undefined;
  if (parsed.data.paymentStatus !== undefined)
    updates.paymentStatus = parsed.data.paymentStatus;
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;

  if (parsed.data.paymentStatus === "paid") {
    updates.paidAt = new Date();
  }

  try {
    const db = await getDb();
    const result = await db
      .collection<VoucherDoc>("vouchers")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updates },
        { returnDocument: "after" }
      );

    if (!result) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      voucher: { ...result, _id: String(result._id) },
    });
  } catch (err) {
    console.error("[admin/vouchers PATCH]", err);
    return NextResponse.json({ ok: false, error: "עדכון נכשל" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const result = await db
      .collection<VoucherDoc>("vouchers")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/vouchers DELETE]", err);
    return NextResponse.json({ ok: false, error: "מחיקה נכשלה" }, { status: 500 });
  }
}
