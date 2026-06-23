/**
 * 7Winds email relay — deploy as web app (Execute as: Me, Access: Anyone).
 * Next.js POSTs notification payloads; Gmail sends from the authorized account.
 */

function doGet(e) {
  const page = e && e.parameter && e.parameter.page;
  if (page === "status") {
    return jsonOutput_(getStatus());
  }
  return HtmlService.createHtmlOutputFromFile("Setup")
    .setTitle("7Winds Email Setup")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    const secret = getProp_("API_SECRET");
    if (!secret) {
      return jsonOutput_({ ok: false, error: "Not configured" });
    }

    const body = JSON.parse(e.postData.contents);
    if (body.secret !== secret) {
      return jsonOutput_({ ok: false, error: "Unauthorized" });
    }

    const to = (body.to || getProp_("NOTIFY_EMAIL") || "").trim();
    if (!to) {
      return jsonOutput_({ ok: false, error: "No recipient" });
    }

    GmailApp.sendEmail(to, body.subject, body.text, {
      htmlBody: body.html,
      name: body.fromName || "7Winds",
    });

    return jsonOutput_({ ok: true });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err) });
  }
}

function saveSetup(apiSecret, notifyEmail) {
  const secret = String(apiSecret || "").trim();
  const email = String(notifyEmail || "").trim();

  if (secret.length < 16) {
    throw new Error("API secret must be at least 16 characters");
  }
  if (!email || email.indexOf("@") === -1) {
    throw new Error("Enter a valid notify email address");
  }

  PropertiesService.getScriptProperties().setProperties({
    API_SECRET: secret,
    NOTIFY_EMAIL: email,
  });

  return { ok: true };
}

/** Run once from the setup page to grant gmail.send to this account. */
function authorizeGmail() {
  GmailApp.getAliases();
  return {
    ok: true,
    email: Session.getEffectiveUser().getEmail(),
  };
}

function sendTestEmail() {
  const to = getProp_("NOTIFY_EMAIL");
  if (!to) {
    throw new Error("Save setup first — notify email is missing");
  }

  GmailApp.sendEmail(
    to,
    "[7Winds] Test notification",
    "Gmail authorization is working.",
    { htmlBody: "<p>Gmail authorization is working.</p>", name: "7Winds" }
  );

  return { ok: true, to: to };
}

function getStatus() {
  const props = PropertiesService.getScriptProperties();
  const notifyEmail = props.getProperty("NOTIFY_EMAIL") || "";
  const hasSecret = Boolean(props.getProperty("API_SECRET"));

  return {
    configured: hasSecret && Boolean(notifyEmail),
    notifyEmail: notifyEmail,
    authorizedEmail: Session.getEffectiveUser().getEmail(),
  };
}

function getProp_(key) {
  return PropertiesService.getScriptProperties().getProperty(key) || "";
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
