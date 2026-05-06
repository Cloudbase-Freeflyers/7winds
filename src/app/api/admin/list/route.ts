import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { LeadDoc, VoucherDoc } from "@/types/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RowType = "leads" | "vouchers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") || "leads") as RowType;
  const format = searchParams.get("format") || "json";

  if (type !== "leads" && type !== "vouchers") {
    return NextResponse.json(
      { ok: false, error: "type must be 'leads' or 'vouchers'" },
      { status: 400 }
    );
  }

  try {
    const db = await getDb();
    const docs = await db
      .collection<LeadDoc | VoucherDoc>(type)
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const rows = docs.map((d) => ({
      ...d,
      _id: String(d._id),
      createdAt:
        d.createdAt instanceof Date
          ? d.createdAt.toISOString()
          : String(d.createdAt),
    }));

    if (format === "csv") {
      const csv = toCsv(rows);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${type}.csv"`,
        },
      });
    }

    return NextResponse.json({ ok: true, rows });
  } catch (err) {
    console.error("[admin/list]", err);
    return NextResponse.json(
      { ok: false, error: "Failed to load rows" },
      { status: 500 }
    );
  }
}

function toCsv(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return "";
  const headers = Array.from(
    rows.reduce<Set<string>>((acc, r) => {
      Object.keys(r).forEach((k) => acc.add(k));
      return acc;
    }, new Set())
  );
  const escape = (v: unknown) => {
    if (v === undefined || v === null) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const head = headers.join(",");
  const body = rows.map((r) => headers.map((h) => escape(r[h])).join(","));
  return [head, ...body].join("\n");
}
