import { BRAND, PACKAGE_LABELS } from "@/lib/constants";
import { getConnectedEmailSender } from "@/lib/email-sender";
import { getGoogleOAuthCredentials } from "@/lib/gmail-oauth";
import { getConfiguredSiteUrl } from "@/lib/site-url";
import { getApprovedEmailsForTopic } from "@/lib/notification-subscribers";
import type { NotificationTopic } from "@/types/notifications";
import type { LeadDoc, VoucherDoc } from "@/types/submissions";

function getSystemNotifyEmail(): string | null {
  return process.env.NOTIFY_EMAIL?.trim() || null;
}

function isAppsScriptConfigured(): boolean {
  return Boolean(
    process.env.APPS_SCRIPT_WEBAPP_URL?.trim() &&
      process.env.APPS_SCRIPT_SECRET?.trim()
  );
}

export async function isEmailConfigured(): Promise<boolean> {
  const connected = await getConnectedEmailSender();
  if (connected) return true;
  if (isAppsScriptConfigured()) return true;
  return Boolean(
    getGoogleOAuthCredentials() &&
      process.env.GOOGLE_REFRESH_TOKEN?.trim() &&
      process.env.GMAIL_SENDER?.trim() &&
      getSystemNotifyEmail()
  );
}

export async function getEmailConfigSummary() {
  const connected = await getConnectedEmailSender();
  const appsScriptUrl = process.env.APPS_SCRIPT_WEBAPP_URL?.trim() || null;
  const oauthReady = Boolean(getGoogleOAuthCredentials());
  const configured = await isEmailConfigured();

  return {
    configured,
    provider: connected
      ? ("connected-gmail" as const)
      : isAppsScriptConfigured()
        ? ("apps-script" as const)
        : null,
    connectedSenderEmail: connected?.senderEmail || null,
    connectedAt: connected?.connectedAt?.toISOString() || null,
    oauthReady,
    oauthRedirectUri: oauthReady
      ? `${getConfiguredSiteUrl()}/api/email/oauth/callback`
      : null,
    appsScriptUrl,
    systemNotifyEmail: getSystemNotifyEmail(),
  };
}

async function getTopicRecipients(
  topic: NotificationTopic,
  senderEmail?: string | null
): Promise<string[]> {
  const approved = await getApprovedEmailsForTopic(topic);
  const system = getSystemNotifyEmail();
  const emails = new Set<string>();
  if (system) emails.add(system.toLowerCase());
  if (senderEmail) emails.add(senderEmail.toLowerCase());
  for (const email of approved) emails.add(email.toLowerCase());
  return [...emails];
}

async function sendViaConnectedGmail(
  sender: { senderEmail: string; refreshToken: string },
  params: { to: string; subject: string; text: string; html: string }
) {
  const creds = getGoogleOAuthCredentials();
  if (!creds) throw new Error("Google OAuth is not configured");

  const { google } = await import("googleapis");
  const oauth2 = new google.auth.OAuth2(creds.clientId, creds.clientSecret);
  oauth2.setCredentials({
    refresh_token: sender.refreshToken,
    scope: "https://www.googleapis.com/auth/gmail.send",
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2 });
  const boundary = `7winds_${Date.now()}`;
  const encodeSubject = (subject: string) =>
    `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;

  const lines = [
    `From: ${sender.senderEmail}`,
    `To: ${params.to}`,
    `Subject: ${encodeSubject(params.subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(params.text, "utf8").toString("base64"),
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(params.html, "utf8").toString("base64"),
    `--${boundary}--`,
  ];

  const raw = Buffer.from(lines.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
}

async function sendViaAppsScript(params: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const url = process.env.APPS_SCRIPT_WEBAPP_URL!.trim();
  const secret = process.env.APPS_SCRIPT_SECRET!.trim();

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
      fromName: "7Winds",
    }),
    redirect: "follow",
  });

  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
  };

  if (!res.ok || !data.ok) {
    throw new Error(data.error || `Apps Script send failed (${res.status})`);
  }
}

function adminUrl(path: string): string {
  return `${BRAND.url}${path}`;
}

function simpleHtml(body: string): string {
  const escaped = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
  return `<!DOCTYPE html><html lang="he" dir="rtl"><body style="font-family:sans-serif;line-height:1.5">${escaped}</body></html>`;
}

export function notifyAsync(fn: () => Promise<void>): void {
  fn().catch((err) => console.error("[email]", err));
}

/**
 * Resolve recipients for a topic and send one alert to each, via the connected
 * Gmail account (preferred) or Apps Script. No-op when email isn't configured
 * or no one is subscribed to the topic.
 */
async function notifyTopic(
  topic: NotificationTopic,
  build: (sender: { senderEmail: string } | null) => { subject: string; text: string }
): Promise<void> {
  if (!(await isEmailConfigured())) return;

  const connected = await getConnectedEmailSender();
  const recipients = await getTopicRecipients(topic, connected?.senderEmail);
  if (recipients.length === 0) return;

  const { subject, text } = build(connected);
  const html = simpleHtml(text);

  for (const to of recipients) {
    if (connected) {
      await sendViaConnectedGmail(connected, { to, subject, text, html });
    } else if (isAppsScriptConfigured()) {
      await sendViaAppsScript({ to, subject, text, html });
    }
  }
}

/** Lead alerts — sent from the connected Gmail account. */
export async function notifyNewLead(lead: LeadDoc): Promise<void> {
  await notifyTopic("leads", () => {
    const sourceLabel =
      lead.source === "accessibility" ? "נגישות" : "טופס יצירת קשר";
    const affiliateLine = lead.affiliateCode
      ? `\nשותף / מודעה: ${lead.affiliateCode}`
      : "";

    const text = [
      "פנייה חדשה באתר 7Winds",
      "",
      `שם: ${lead.name}`,
      `טלפון: ${lead.phone}`,
      lead.message ? `הודעה: ${lead.message}` : null,
      `מקור: ${sourceLabel}`,
      affiliateLine || null,
      "",
      `ניהול: ${adminUrl("/admin/leads")}`,
    ]
      .filter(Boolean)
      .join("\n");

    return { subject: `[7Winds] פנייה חדשה — ${lead.name}`, text };
  });
}

/** New gift-voucher request — alerts subscribers opted into "vouchers". */
export async function notifyNewVoucher(voucher: VoucherDoc): Promise<void> {
  await notifyTopic("vouchers", () => {
    const affiliateLine = voucher.affiliateCode
      ? `\nשותף / מודעה: ${voucher.affiliateCode}`
      : "";

    const text = [
      "בקשת שובר מתנה חדשה באתר 7Winds",
      "",
      `קונה: ${voucher.buyerName}`,
      `טלפון: ${voucher.buyerPhone}`,
      voucher.buyerEmail ? `אימייל: ${voucher.buyerEmail}` : null,
      `חבילה: ${PACKAGE_LABELS[voucher.package] ?? voucher.package}`,
      voucher.recipientName ? `מקבל/ת השובר: ${voucher.recipientName}` : null,
      voucher.occasion ? `אירוע: ${voucher.occasion}` : null,
      voucher.notes ? `הערות: ${voucher.notes}` : null,
      affiliateLine || null,
      "",
      `ניהול: ${adminUrl("/admin/leads")}`,
    ]
      .filter(Boolean)
      .join("\n");

    return { subject: `[7Winds] בקשת שובר חדשה — ${voucher.buyerName}`, text };
  });
}

/** Confirmed payment — alerts subscribers opted into "payments". */
export async function notifyVoucherPaid(voucher: VoucherDoc): Promise<void> {
  await notifyTopic("payments", () => {
    const amountLine =
      typeof voucher.amount === "number" ? `סכום: ₪${voucher.amount}` : null;

    const text = [
      "תשלום אושר באתר 7Winds",
      "",
      `קונה: ${voucher.buyerName}`,
      `טלפון: ${voucher.buyerPhone}`,
      `חבילה: ${PACKAGE_LABELS[voucher.package] ?? voucher.package}`,
      amountLine,
      voucher.orderId ? `מספר הזמנה: ${voucher.orderId}` : null,
      voucher.icountDocNum ? `חשבונית iCount: ${voucher.icountDocNum}` : null,
      voucher.affiliateCode ? `שותף / מודעה: ${voucher.affiliateCode}` : null,
      "",
      `ניהול: ${adminUrl("/admin/leads")}`,
    ]
      .filter(Boolean)
      .join("\n");

    return { subject: `[7Winds] תשלום אושר — ${voucher.buyerName}`, text };
  });
}
