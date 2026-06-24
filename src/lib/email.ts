import { after } from "next/server";
import { BRAND, PACKAGE_LABELS } from "@/lib/constants";
import { getConnectedEmailSender } from "@/lib/email-sender";
import { getGoogleOAuthCredentials } from "@/lib/gmail-oauth";
import { getConfiguredSiteUrl } from "@/lib/site-url";
import { getApprovedEmailsForTopic } from "@/lib/notification-subscribers";
import { logActivity } from "@/lib/activity-log";
import {
  renderNotificationEmail,
  type EmailRow,
  type NotificationEmail,
} from "@/lib/email-template";
import type { NotificationTopic } from "@/types/notifications";
import type { EmailSenderDoc } from "@/types/email-sender";
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

/**
 * Recipients for a topic are the approved subscribers in the DB only — managed
 * from the admin notifications screen, not from env vars. (NOTIFY_EMAIL and the
 * connected sender are no longer auto-added; add them to the list explicitly to
 * receive mail.)
 */
async function getTopicRecipients(topic: NotificationTopic): Promise<string[]> {
  const approved = await getApprovedEmailsForTopic(topic);
  const emails = new Set<string>();
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

/** Build a row list, dropping any rows whose value is missing. */
function rowList(
  ...items: (EmailRow | null | undefined | false | "" | 0)[]
): EmailRow[] {
  return items.filter((r): r is EmailRow => Boolean(r));
}

const ACCENT = { sky: "#1ABBEF", green: "#8BC441", yellow: "#FDD62A" } as const;

/**
 * Run notification/log work after the response is sent. Uses Next's after() so
 * Vercel keeps the serverless function alive until it finishes — a plain
 * fire-and-forget promise is killed when the function freezes on response,
 * which silently dropped notifications (and their activity-log rows).
 */
export function notifyAsync(fn: () => Promise<void>): void {
  after(async () => {
    try {
      await fn();
    } catch (err) {
      console.error("[email]", err);
    }
  });
}

/** Send one message to every recipient via the connected Gmail or Apps Script. */
async function dispatch(
  connected: EmailSenderDoc | null,
  recipients: string[],
  msg: { subject: string; text: string; html: string }
): Promise<void> {
  for (const to of recipients) {
    if (connected) {
      await sendViaConnectedGmail(connected, { to, ...msg });
    } else if (isAppsScriptConfigured()) {
      await sendViaAppsScript({ to, ...msg });
    }
  }
}

/**
 * Resolve approved recipients for a topic and send one branded alert to each,
 * via the connected Gmail account (preferred) or Apps Script. Records a single
 * activity log row per event (all recipients combined), including
 * skipped/failed reasons so the admin can see why a notification did or didn't
 * go out.
 */
async function notifyTopic(
  topic: NotificationTopic,
  build: () => NotificationEmail
): Promise<void> {
  const content = build();
  const logTitle = content.subheading
    ? `${content.heading} — ${content.subheading}`
    : content.heading;
  const connected = await getConnectedEmailSender();

  if (!(await isEmailConfigured())) {
    await logActivity({
      type: "notification",
      title: logTitle,
      detail: `${topic} — אימייל לא מוגדר`,
      status: "skipped",
      error: "email_not_configured",
    });
    return;
  }

  const recipients = await getTopicRecipients(topic);
  if (recipients.length === 0) {
    await logActivity({
      type: "notification",
      title: logTitle,
      detail: `${topic} — אין נמענים מאושרים`,
      status: "skipped",
    });
    return;
  }

  const { html, text } = renderNotificationEmail(content);

  try {
    await dispatch(connected, recipients, { subject: content.subject, text, html });
    await logActivity({
      type: "notification",
      title: logTitle,
      detail: topic,
      recipients,
      status: "sent",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await logActivity({
      type: "notification",
      title: logTitle,
      detail: topic,
      recipients,
      status: "failed",
      error: msg,
    });
    throw err;
  }
}

/**
 * Send a test notification to the topic's approved recipients (or a single
 * address if provided). Surfaces send errors to the caller instead of
 * swallowing them, so the admin can confirm delivery from the UI.
 */
export async function sendTestNotification(
  topic: NotificationTopic = "leads",
  to?: string
): Promise<{ recipients: string[] }> {
  if (!(await isEmailConfigured())) {
    throw new Error("אימייל לא מחובר — חברו חשבון Gmail תחילה.");
  }

  const connected = await getConnectedEmailSender();
  const recipients = to?.trim()
    ? [to.trim().toLowerCase()]
    : await getTopicRecipients(topic);
  if (recipients.length === 0) {
    throw new Error(
      "אין נמענים מאושרים — אשרו אימייל ברשימה או ציינו כתובת לבדיקה."
    );
  }

  const { html, text } = renderNotificationEmail({
    subject: "7Winds · בדיקת התראות",
    kicker: "בדיקה",
    heading: "בדיקת מערכת ההתראות",
    accent: ACCENT.sky,
    rows: rowList(
      { label: "סוג התראה", value: topic },
      { label: "נשלח מ", value: connected?.senderEmail ?? "—", ltr: true }
    ),
    note: { text: "אם קיבלת הודעה זו — ההתראות פעילות. ✓", tone: "success" },
  });

  try {
    await dispatch(connected, recipients, {
      subject: "7Winds · בדיקת התראות",
      text,
      html,
    });
    await logActivity({
      type: "notification",
      title: "בדיקת התראות",
      detail: `בדיקה (${topic})`,
      recipients,
      status: "sent",
    });
    return { recipients };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await logActivity({
      type: "notification",
      title: "בדיקת התראות",
      detail: `בדיקה (${topic})`,
      recipients,
      status: "failed",
      error: msg,
    });
    throw err;
  }
}

/** Lead alerts — sent from the connected Gmail account. */
export async function notifyNewLead(lead: LeadDoc): Promise<void> {
  await notifyTopic("leads", () => {
    const sourceLabel =
      lead.source === "accessibility" ? "נגישות" : "טופס יצירת קשר";

    return {
      subject: `7Winds · פנייה חדשה — ${lead.name}`,
      kicker: "ליד חדש",
      heading: "פנייה חדשה מהאתר",
      subheading: lead.name,
      accent: ACCENT.sky,
      rows: rowList(
        { label: "שם", value: lead.name },
        { label: "טלפון", value: lead.phone, ltr: true },
        lead.message && { label: "הודעה", value: lead.message },
        { label: "מקור", value: sourceLabel },
        lead.affiliateCode && {
          label: "שותף / מודעה",
          value: lead.affiliateCode,
        }
      ),
      cta: { label: "פתיחת הליד בניהול", url: adminUrl("/admin/leads") },
    };
  });
}

/**
 * New voucher request or checkout order — alerts subscribers opted into
 * "vouchers". Wording adapts to a gift-voucher request vs a direct booking
 * (still awaiting payment at this point).
 */
export async function notifyNewVoucher(voucher: VoucherDoc): Promise<void> {
  await notifyTopic("vouchers", () => {
    const isDirect = voucher.orderType === "direct";

    return {
      subject: `7Winds · ${isDirect ? "הזמנה חדשה" : "בקשת שובר"} — ${voucher.buyerName}`,
      kicker: isDirect ? "הזמנה חדשה" : "שובר מתנה",
      heading: isDirect ? "הזמנה חדשה" : "בקשת שובר מתנה",
      subheading: voucher.buyerName,
      accent: ACCENT.yellow,
      rows: rowList(
        { label: "קונה", value: voucher.buyerName },
        { label: "טלפון", value: voucher.buyerPhone, ltr: true },
        voucher.buyerEmail && {
          label: "אימייל",
          value: voucher.buyerEmail,
          ltr: true,
        },
        {
          label: "חבילה",
          value: PACKAGE_LABELS[voucher.package] ?? voucher.package,
        },
        typeof voucher.amount === "number" && {
          label: "סכום",
          value: `₪${voucher.amount}`,
        },
        voucher.recipientName && {
          label: "מקבל/ת השובר",
          value: voucher.recipientName,
        },
        voucher.occasion && { label: "אירוע", value: voucher.occasion },
        voucher.notes && { label: "הערות", value: voucher.notes },
        voucher.affiliateCode && {
          label: "שותף / מודעה",
          value: voucher.affiliateCode,
        }
      ),
      note:
        voucher.paymentStatus === "pending"
          ? { text: "ממתין לתשלום", tone: "warning" }
          : undefined,
      cta: { label: "פתיחה בניהול", url: adminUrl("/admin/leads") },
    };
  });
}

/** Confirmed payment — alerts subscribers opted into "payments". */
export async function notifyVoucherPaid(voucher: VoucherDoc): Promise<void> {
  await notifyTopic("payments", () => ({
    subject: `7Winds · תשלום אושר — ${voucher.buyerName}`,
    kicker: "תשלום",
    heading: "תשלום אושר",
    subheading: voucher.buyerName,
    accent: ACCENT.green,
    rows: rowList(
      { label: "קונה", value: voucher.buyerName },
      { label: "טלפון", value: voucher.buyerPhone, ltr: true },
      {
        label: "חבילה",
        value: PACKAGE_LABELS[voucher.package] ?? voucher.package,
      },
      typeof voucher.amount === "number" && {
        label: "סכום",
        value: `₪${voucher.amount}`,
      },
      voucher.orderId && { label: "מספר הזמנה", value: voucher.orderId, ltr: true },
      voucher.icountDocNum && {
        label: "חשבונית iCount",
        value: String(voucher.icountDocNum),
        ltr: true,
      },
      voucher.affiliateCode && {
        label: "שותף / מודעה",
        value: voucher.affiliateCode,
      }
    ),
    note: { text: "✓ שולם", tone: "success" },
    cta: { label: "פתיחה בניהול", url: adminUrl("/admin/leads") },
  }));
}
