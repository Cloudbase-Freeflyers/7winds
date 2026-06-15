import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { adminLeadUpdateSchema, normalizePhone } from "@/lib/validation";
import type { LeadDoc } from "@/types/submissions";

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

  const parsed = adminLeadUpdateSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "פרטים לא תקינים";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }

  const updates: Partial<LeadDoc> = { updatedAt: new Date() };
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.phone !== undefined)
    updates.phone = normalizePhone(parsed.data.phone);
  if (parsed.data.message !== undefined)
    updates.message = parsed.data.message || undefined;
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;

  try {
    const db = await getDb();
    const result = await db
      .collection<LeadDoc>("leads")
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
      lead: { ...result, _id: String(result._id) },
    });
  } catch (err) {
    console.error("[admin/leads PATCH]", err);
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
      .collection<LeadDoc>("leads")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/leads DELETE]", err);
    return NextResponse.json({ ok: false, error: "מחיקה נכשלה" }, { status: 500 });
  }
}
