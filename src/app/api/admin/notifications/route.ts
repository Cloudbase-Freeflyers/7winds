import { NextResponse } from "next/server";
import {
  getApprovedNotificationEmails,
  listNotificationSubscribers,
} from "@/lib/notification-subscribers";
import { getEmailConfigSummary } from "@/lib/email";

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
