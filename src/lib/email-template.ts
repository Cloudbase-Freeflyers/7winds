import { BRAND } from "@/lib/constants";

export type EmailRow = { label: string; value: string; ltr?: boolean };
export type EmailTone = "info" | "success" | "warning";

export interface NotificationEmail {
  /** Email subject line. */
  subject: string;
  /** Small eyebrow chip above the title, e.g. "ליד חדש". */
  kicker?: string;
  /** Big title in the body. */
  heading: string;
  /** Secondary line under the title (usually the person's name). */
  subheading?: string;
  rows: EmailRow[];
  /** Highlighted status note, e.g. payment pending / confirmed. */
  note?: { text: string; tone?: EmailTone };
  cta?: { label: string; url: string };
  /** Header/kicker accent — defaults to brand sky. */
  accent?: string;
}

const ACCENT_SOFT: Record<string, string> = {
  "#1ABBEF": "#E7F7FD",
  "#8BC441": "#EEF8E2",
  "#FDD62A": "#FFF8DA",
};

const TONE: Record<EmailTone, { bg: string; fg: string }> = {
  info: { bg: "#E7F7FD", fg: "#0A6A8A" },
  success: { bg: "#EEF8E2", fg: "#3F6212" },
  warning: { bg: "#FFF8DA", fg: "#7A5B00" },
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderText(c: NotificationEmail): string {
  return [
    c.kicker ? `[${c.kicker}]` : null,
    c.heading,
    c.subheading || null,
    "",
    ...c.rows.map((r) => `${r.label}: ${r.value}`),
    c.note ? `\n${c.note.text}` : null,
    c.cta ? `\n${c.cta.label}: ${c.cta.url}` : null,
    "",
    `— ${BRAND.name}`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

function renderHtml(c: NotificationEmail): string {
  const accent = c.accent || "#1ABBEF";
  const accentSoft = ACCENT_SOFT[accent] ?? "#E7F7FD";
  const preheader = c.subheading || c.heading;

  const rowsHtml = c.rows
    .map(
      (r) => `
            <tr>
              <td style="padding:11px 0;border-bottom:1px solid #EEF2F5;font-size:13px;color:#4E4E4E;vertical-align:top;white-space:nowrap;">${esc(
                r.label
              )}</td>
              <td style="padding:11px 0 11px 14px;border-bottom:1px solid #EEF2F5;font-size:15px;color:#050606;font-weight:600;vertical-align:top;"${
                r.ltr ? ' dir="ltr" align="left"' : ' dir="auto"'
              }>${esc(r.value)}</td>
            </tr>`
    )
    .join("");

  const noteHtml = c.note
    ? `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;">
            <tr><td style="background:${TONE[c.note.tone ?? "info"].bg};color:${
        TONE[c.note.tone ?? "info"].fg
      };padding:12px 16px;border-radius:10px;font-size:14px;font-weight:700;" align="center">${esc(
        c.note.text
      )}</td></tr>
          </table>`
    : "";

  const ctaHtml = c.cta
    ? `
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
            <tr><td style="border-radius:9999px;background:#050606;">
              <a href="${esc(
                c.cta.url
              )}" style="display:inline-block;padding:13px 30px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:9999px;">${esc(
        c.cta.label
      )}</a>
            </td></tr>
          </table>`
    : "";

  return `<!DOCTYPE html>
<html lang="he" dir="rtl" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>${esc(c.subject)}</title>
</head>
<body style="margin:0;padding:0;background:#F5F8FA;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F8FA;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E6EDF2;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
        <tr><td align="right" style="background:${accent};background-image:linear-gradient(135deg,#1ABBEF 0%,#8BC441 60%,#FDD62A 100%);padding:24px 28px;">
          <div style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:.5px;">7Winds</div>
          <div style="color:rgba(255,255,255,.92);font-size:12px;margin-top:2px;">מועדון מצנחי רחיפה</div>
        </td></tr>
        <tr><td align="right" dir="rtl" style="padding:28px;">
          ${
            c.kicker
              ? `<span style="display:inline-block;background:${accentSoft};color:${accent};font-size:12px;font-weight:700;padding:5px 13px;border-radius:9999px;margin-bottom:12px;">${esc(
                  c.kicker
                )}</span>`
              : ""
          }
          <h1 style="margin:0;font-size:22px;line-height:1.3;color:#050606;font-weight:800;">${esc(
            c.heading
          )}</h1>
          ${
            c.subheading
              ? `<p style="margin:6px 0 0;font-size:16px;color:#4E4E4E;">${esc(
                  c.subheading
                )}</p>`
              : ""
          }
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border-collapse:collapse;">${rowsHtml}
          </table>${noteHtml}${ctaHtml}
        </td></tr>
        <tr><td align="center" style="padding:18px 28px;background:#F5F8FA;border-top:1px solid #E6EDF2;">
          <div style="font-size:12px;color:#4E4E4E;">${esc(BRAND.name)}</div>
          <div style="font-size:11px;color:#9AA6AD;margin-top:4px;">הודעה אוטומטית ממערכת ההתראות</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function renderNotificationEmail(c: NotificationEmail): {
  html: string;
  text: string;
} {
  return { html: renderHtml(c), text: renderText(c) };
}
