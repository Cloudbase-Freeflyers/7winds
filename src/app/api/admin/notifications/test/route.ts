import { NextResponse } from "next/server";
import { sendTestNotification } from "@/lib/email";
import type { NotificationTopic } from "@/types/notifications";

export const runtime = "nodejs";

const TOPICS: NotificationTopic[] = ["leads", "vouchers", "payments"];

export async function POST(req: Request) {
  let body: { topic?: string; to?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body is fine — defaults apply */
  }

  const topic = TOPICS.includes(body.topic as NotificationTopic)
    ? (body.topic as NotificationTopic)
    : "leads";

  try {
    const { recipients } = await sendTestNotification(topic, body.to);
    return NextResponse.json({ ok: true, recipients });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "שליחה נכשלה";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
