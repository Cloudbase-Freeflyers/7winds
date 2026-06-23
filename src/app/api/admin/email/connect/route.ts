import { NextResponse } from "next/server";
import { clearConnectedEmailSender } from "@/lib/email-sender";
import {
  buildGoogleAuthUrl,
  createOAuthState,
  isGoogleOAuthConfigured,
} from "@/lib/gmail-oauth";

export const runtime = "nodejs";

export async function GET() {
  if (!isGoogleOAuthConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Google OAuth לא מוגדר. הוסיפו GOOGLE_CLIENT_ID ו-GOOGLE_CLIENT_SECRET.",
      },
      { status: 503 }
    );
  }

  const state = createOAuthState("gmail");
  const url = buildGoogleAuthUrl(state);
  return NextResponse.redirect(url);
}

export async function DELETE() {
  try {
    await clearConnectedEmailSender();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/email/connect delete]", err);
    return NextResponse.json({ ok: false, error: "ניתוק נכשל" }, { status: 500 });
  }
}
