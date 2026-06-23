import { NextResponse } from "next/server";
import { requestNotificationSubscription } from "@/lib/notification-subscribers";
import { notificationSubscribeSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = notificationSubscribeSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "פרטים לא תקינים";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }

  try {
    const result = await requestNotificationSubscription({
      email: parsed.data.email,
      name: parsed.data.name || undefined,
    });

    return NextResponse.json({
      ok: true,
      status: result.status,
      message:
        result.status === "approved"
          ? "כבר מאושרים לקבלת התראות על לידים."
          : "הבקשה נשלחה — ממתין לאישור מנהל.",
    });
  } catch (err) {
    console.error("[notifications/subscribe]", err);
    return NextResponse.json(
      { ok: false, error: "שמירה נכשלה. נסו שוב." },
      { status: 500 }
    );
  }
}
