import { BRAND, CONTACT } from "@/lib/constants";

export function affiliateBannerHtml(params: {
  name: string;
  code: string;
  url: string;
  qrDataUrl: string;
}) {
  const { name, code, url, qrDataUrl } = params;
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>באנר שיווקי — ${name} — 7Winds</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #f0f4f8; padding: 24px; }
    .banner {
      width: 800px; height: 400px; margin: 0 auto;
      background: linear-gradient(135deg, #021929 0%, #0762a0 50%, #1ABBEF 100%);
      border-radius: 24px; overflow: hidden; position: relative;
      color: white; display: flex; align-items: center; justify-content: space-between;
      padding: 40px 48px; box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    }
    .logo { font-size: 42px; font-weight: 900; }
    .logo span { color: #FDD62A; }
    .tagline { font-size: 22px; font-weight: 700; margin-top: 8px; }
    .sub { font-size: 14px; opacity: 0.8; margin-top: 12px; max-width: 360px; line-height: 1.5; }
    .partner { margin-top: 20px; font-size: 13px; background: rgba(255,255,255,0.15); display: inline-block; padding: 6px 14px; border-radius: 999px; }
    .qr-box { background: white; border-radius: 16px; padding: 12px; text-align: center; }
    .qr-box img { width: 140px; height: 140px; display: block; }
    .qr-box p { color: #021929; font-size: 11px; margin-top: 8px; font-weight: 700; word-break: break-all; max-width: 160px; }
    .url { font-size: 12px; opacity: 0.7; margin-top: 16px; direction: ltr; text-align: start; }
    @media print { body { padding: 0; background: white; } .banner { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="banner">
    <div>
      <div class="logo"><span>7</span>winds</div>
      <div class="tagline">🪂 טיסת חוויה במצנח רחיפה</div>
      <div class="sub">10 דקות מעל הים — חוויה לכל החיים. אין צורך בניסיון!</div>
      <div class="partner">שותף: ${escapeHtml(name)} · ${escapeHtml(code)}</div>
      <div class="url">${escapeHtml(url)}</div>
    </div>
    <div class="qr-box">
      <img src="${qrDataUrl}" alt="QR" />
      <p>סרקו לקביעת טיסה</p>
    </div>
  </div>
  <p style="text-align:center;margin-top:16px;color:#666;font-size:13px;">
    הדפיסו או שמרו כ-PDF (Ctrl+P) · ${escapeHtml(BRAND.hebrewName)} · ${escapeHtml(CONTACT.phoneDisplay)}
  </p>
</body>
</html>`;
}

export function affiliatePrintableCardHtml(params: {
  name: string;
  code: string;
  url: string;
  qrDataUrl: string;
}) {
  const { name, code, url, qrDataUrl } = params;
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>כרטיס שיווקי — ${name} — 7Winds</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #eee; padding: 24px; }
    .sheet { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; }
    .card {
      width: 340px; height: 200px; background: white; border-radius: 16px;
      border: 2px solid #1ABBEF; overflow: hidden; display: flex;
      box-shadow: 0 4px 20px rgba(0,0,0,0.12); page-break-inside: avoid;
    }
    .card-body { flex: 1; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; }
    .logo { font-size: 22px; font-weight: 900; color: #021929; }
    .logo span { color: #FDD62A; }
    .title { font-size: 13px; font-weight: 700; color: #0762a0; margin-top: 4px; }
    .phone { font-size: 18px; font-weight: 900; color: #f97316; direction: ltr; text-align: start; }
    .partner { font-size: 10px; color: #666; }
    .qr-side { width: 120px; background: #f0f9ff; display: flex; align-items: center; justify-content: center; padding: 8px; }
    .qr-side img { width: 96px; height: 96px; }
    .url { font-size: 9px; color: #888; direction: ltr; word-break: break-all; margin-top: 4px; }
    @media print {
      body { padding: 0; background: white; }
      .card { box-shadow: none; margin: 8px; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    ${[1, 2, 3, 4].map(() => `
    <div class="card">
      <div class="card-body">
        <div>
          <div class="logo"><span>7</span>winds</div>
          <div class="title">🪂 טיסת מצנח רחיפה</div>
        </div>
        <div>
          <div class="phone">${escapeHtml(CONTACT.phoneDisplay)}</div>
          <div class="partner">שותף: ${escapeHtml(name)}</div>
          <div class="url">${escapeHtml(url)}</div>
        </div>
      </div>
      <div class="qr-side">
        <img src="${qrDataUrl}" alt="QR" />
      </div>
    </div>`).join("")}
  </div>
  <p style="text-align:center;margin-top:16px;color:#666;font-size:13px;">
    4 כרטיסים לדף · הדפיסו וחתכו (Ctrl+P) · קוד: ${escapeHtml(code)}
  </p>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
