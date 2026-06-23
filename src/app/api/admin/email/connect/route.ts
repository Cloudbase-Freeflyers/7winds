import { NextResponse } from "next/server";
import {
  clearConnectedEmailSender,
  getConnectedEmailSender,
} from "@/lib/email-sender";
import {
  buildGoogleAuthUrl,
  createOAuthState,
  isGoogleOAuthConfigured,
} from "@/lib/gmail-oauth";

export const runtime = "nodejs";

export async function GET(req: Request) {
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

  const { searchParams } = new URL(req.url);
  const existing = await getConnectedEmailSender();
  const forceConsent = searchParams.get("reconnect") === "1" || !existing;
  const state = createOAuthState("gmail");
  const url = buildGoogleAuthUrl(state, { forceConsent });
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
