import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { affiliatePayoutSchema } from "@/lib/validation";
import type { AffiliateDoc } from "@/types/affiliates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
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

  const parsed = affiliatePayoutSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "פרטים לא תקינים";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }

  try {
    const db = await getDb();
    const existing = await db
      .collection<AffiliateDoc>("affiliates")
      .findOne({ _id: new ObjectId(id) });

    if (!existing) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    const payoutNote = parsed.data.notes
      ? `${existing.notes ? existing.notes + "\n" : ""}[תשלום ${new Date().toLocaleDateString("he-IL")}] ₪${parsed.data.amount}: ${parsed.data.notes}`
      : existing.notes;

    const result = await db
      .collection<AffiliateDoc>("affiliates")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            payoutStatus: parsed.data.payoutStatus,
            notes: payoutNote,
            updatedAt: new Date(),
          },
          $inc: { totalPaid: parsed.data.amount },
        },
        { returnDocument: "after" }
      );

    return NextResponse.json({
      ok: true,
      affiliate: { ...result, _id: String(result?._id) },
    });
  } catch (err) {
    console.error("[admin/affiliates/payout]", err);
    return NextResponse.json(
      { ok: false, error: "רישום תשלום נכשל" },
      { status: 500 }
    );
  }
}
