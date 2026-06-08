import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { listAffiliates, slugifyCode } from "@/lib/affiliates";
import { affiliateCreateSchema } from "@/lib/validation";
import type { AffiliateDoc } from "@/types/affiliates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const affiliates = await listAffiliates();
    const rows = affiliates.map((a) => ({
      ...a,
      _id: String(a._id),
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));
    return NextResponse.json({ ok: true, rows });
  } catch (err) {
    console.error("[admin/affiliates GET]", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load affiliates" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = affiliateCreateSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "פרטים לא תקינים";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }

  const code = parsed.data.code || slugifyCode(parsed.data.name);
  if (!code) {
    return NextResponse.json({ ok: false, error: "קוד שותף לא תקין" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const existing = await db
      .collection<AffiliateDoc>("affiliates")
      .findOne({ code });

    if (existing) {
      return NextResponse.json(
        { ok: false, error: "קוד שותף כבר קיים" },
        { status: 409 }
      );
    }

    const now = new Date();
    const doc: AffiliateDoc = {
      code,
      name: parsed.data.name,
      phone: parsed.data.phone || undefined,
      commissionRate: parsed.data.commissionRate,
      commissionType: parsed.data.commissionType,
      status: "active",
      payoutStatus: "none",
      totalPaid: 0,
      notes: parsed.data.notes || undefined,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection<AffiliateDoc>("affiliates").insertOne(doc);
    return NextResponse.json({
      ok: true,
      id: result.insertedId.toString(),
      affiliate: { ...doc, _id: result.insertedId.toString() },
    });
  } catch (err) {
    console.error("[admin/affiliates POST]", err);
    return NextResponse.json(
      { ok: false, error: "יצירת שותף נכשלה" },
      { status: 500 }
    );
  }
}
