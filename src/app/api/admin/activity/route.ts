import { NextResponse } from "next/server";
import { listActivity } from "@/lib/activity-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await listActivity(100);
    return NextResponse.json({
      ok: true,
      rows: rows.map((r) => ({
        _id: String(r._id),
        type: r.type,
        at: r.at instanceof Date ? r.at.toISOString() : String(r.at),
        title: r.title,
        detail: r.detail,
        recipients: r.recipients,
        status: r.status,
        error: r.error,
      })),
    });
  } catch (err) {
    console.error("[admin/activity]", err);
    return NextResponse.json({ ok: false, error: "טעינה נכשלה" }, { status: 500 });
  }
}
