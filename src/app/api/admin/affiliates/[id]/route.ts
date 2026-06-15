import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { hashPassword } from "@/lib/affiliate-auth";
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
  if (parsed.data.code !== undefined) updates.code = parsed.data.code;
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
  if (parsed.data.email !== undefined) {
    updates.email = parsed.data.email
      ? parsed.data.email.toLowerCase()
      : undefined;
  }
  if (parsed.data.password) {
    updates.passwordHash = hashPassword(parsed.data.password);
  }

  try {
    const db = await getDb();
    const existing = await db
      .collection<AffiliateDoc>("affiliates")
      .findOne({ _id: new ObjectId(id) });

    if (!existing) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    if (parsed.data.code && parsed.data.code !== existing.code) {
      const codeTaken = await db
        .collection<AffiliateDoc>("affiliates")
        .findOne({ code: parsed.data.code, _id: { $ne: new ObjectId(id) } });
      if (codeTaken) {
        return NextResponse.json(
          { ok: false, error: "קוד שותף כבר קיים" },
          { status: 409 }
        );
      }
    }

    const nextEmail =
      parsed.data.email !== undefined
        ? parsed.data.email || undefined
        : existing.email;
    const nextPasswordHash =
      updates.passwordHash || existing.passwordHash;

    if (nextEmail && !nextPasswordHash) {
      return NextResponse.json(
        { ok: false, error: "יש להגדיר סיסמה יחד עם אימייל לכניסת שותף" },
        { status: 400 }
      );
    }

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

    const { passwordHash: _passwordHash, ...affiliate } = result;
    return NextResponse.json({
      ok: true,
      affiliate: {
        ...affiliate,
        _id: String(result._id),
        hasLogin: Boolean(result.email && result.passwordHash),
      },
    });
  } catch (err) {
    const message =
      err instanceof Error && "code" in err && err.code === 11000
        ? "אימייל כבר בשימוש"
        : "עדכון נכשל";
    console.error("[admin/affiliates PATCH]", err);
    return NextResponse.json(
      { ok: false, error: message },
      { status: err instanceof Error && "code" in err && err.code === 11000 ? 409 : 500 }
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
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/affiliates DELETE]", err);
    return NextResponse.json(
      { ok: false, error: "מחיקה נכשלה" },
      { status: 500 }
    );
  }
}
