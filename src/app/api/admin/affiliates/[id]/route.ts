import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { affiliateUpdateSchema } from "@/lib/validation";
import type { AffiliateDoc } from "@/types/affiliates";

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

  const parsed = affiliateUpdateSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "פרטים לא תקינים";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }

  const updates: Partial<AffiliateDoc> = {
    updatedAt: new Date(),
  };
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.phone !== undefined)
    updates.phone = parsed.data.phone || undefined;
  if (parsed.data.commissionRate !== undefined)
    updates.commissionRate = parsed.data.commissionRate;
  if (parsed.data.commissionType !== undefined)
    updates.commissionType = parsed.data.commissionType;
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.payoutStatus !== undefined)
    updates.payoutStatus = parsed.data.payoutStatus;
  if (parsed.data.notes !== undefined)
    updates.notes = parsed.data.notes || undefined;

  try {
    const db = await getDb();
    const result = await db
      .collection<AffiliateDoc>("affiliates")
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
      affiliate: { ...result, _id: String(result._id) },
    });
  } catch (err) {
    console.error("[admin/affiliates PATCH]", err);
    return NextResponse.json(
      { ok: false, error: "עדכון נכשל" },
      { status: 500 }
    );
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
      .collection<AffiliateDoc>("affiliates")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status: "inactive", updatedAt: new Date() } },
        { returnDocument: "after" }
      );

    if (!result) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/affiliates DELETE]", err);
    return NextResponse.json(
      { ok: false, error: "השבתה נכשלה" },
      { status: 500 }
    );
  }
}
