import { NextResponse } from "next/server";
import {
  addApprovedSubscriber,
  getApprovedNotificationEmails,
  listNotificationSubscribers,
} from "@/lib/notification-subscribers";
import { getEmailConfigSummary } from "@/lib/email";
import { notificationSubscribeSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as
    | "pending"
    | "approved"
    | "rejected"
    | null;

  try {
    const [subscribers, approved, pending, config] = await Promise.all([
      listNotificationSubscribers(
        status === "pending" || status === "approved" || status === "rejected"
          ? status
          : undefined
      ),
      getApprovedNotificationEmails(),
      listNotificationSubscribers("pending"),
      getEmailConfigSummary(),
    ]);

    const rows = subscribers.map((s) => ({
      _id: String(s._id),
      email: s.email,
      name: s.name,
      status: s.status,
      preferences: s.preferences,
      createdAt:
        s.createdAt instanceof Date
          ? s.createdAt.toISOString()
          : String(s.createdAt),
      approvedAt: s.approvedAt?.toISOString(),
    }));

    return NextResponse.json({
      ok: true,
      rows,
      config: {
        ...config,
        approvedSubscriberCount: approved.length,
        pendingCount: pending.length,
      },
    });
  } catch (err) {
    console.error("[admin/notifications]", err);
    return NextResponse.json(
      { ok: false, error: "טעינה נכשלה" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = notificationSubscribeSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "פרטים לא תקינים";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }

  try {
    const row = await addApprovedSubscriber({
      email: parsed.data.email,
      name: parsed.data.name || undefined,
      preferences: parsed.data.preferences,
    });
    if (!row) {
      return NextResponse.json({ ok: false, error: "הוספה נכשלה" }, { status: 500 });
    }
    return NextResponse.json({
      ok: true,
      row: {
        _id: String(row._id),
        email: row.email,
        name: row.name,
        status: row.status,
        preferences: row.preferences,
        createdAt:
          row.createdAt instanceof Date
            ? row.createdAt.toISOString()
            : String(row.createdAt),
        approvedAt: row.approvedAt?.toISOString(),
      },
    });
  } catch (err) {
    console.error("[admin/notifications POST]", err);
    return NextResponse.json({ ok: false, error: "הוספה נכשלה" }, { status: 500 });
  }
}
