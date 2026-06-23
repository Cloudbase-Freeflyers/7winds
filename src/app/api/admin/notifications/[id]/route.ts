import { NextResponse } from "next/server";
import {
  deleteNotificationSubscriber,
  updateNotificationSubscriber,
} from "@/lib/notification-subscribers";
import { notificationSubscriberUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = notificationSubscriberUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "סטטוס לא תקין" },
      { status: 400 }
    );
  }

  try {
    const result = await updateNotificationSubscriber(id, parsed.data.status);
    if (!result) {
      return NextResponse.json({ ok: false, error: "לא נמצא" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      row: {
        _id: String(result._id),
        email: result.email,
        name: result.name,
        status: result.status,
        approvedAt: result.approvedAt?.toISOString(),
      },
    });
  } catch (err) {
    console.error("[admin/notifications/id]", err);
    return NextResponse.json(
      { ok: false, error: "עדכון נכשל" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;

  try {
    const ok = await deleteNotificationSubscriber(id);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "לא נמצא" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/notifications/id delete]", err);
    return NextResponse.json(
      { ok: false, error: "מחיקה נכשלה" },
      { status: 500 }
    );
  }
}
