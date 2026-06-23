/**
 * One-time Gmail OAuth setup — obtains a refresh token for gmail.send scope.
 *
 * Prerequisites (Google Cloud Console):
 * 1. Create a project → APIs & Services → Enable "Gmail API"
 * 2. OAuth consent screen → External → add scope: .../auth/gmail.send
 * 3. Credentials → Create OAuth client ID → Desktop app
 * 4. Add authorized redirect URI: http://localhost:3333/oauth2callback
 * 5. Put GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
 *
 * Run: npm run gmail-oauth
 * Then add the printed GOOGLE_REFRESH_TOKEN to .env.local
 */
import { createServer } from "http";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const REDIRECT_URI = "http://localhost:3333/oauth2callback";
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

function loadEnvLocal() {
  const path = resolve(root, ".env.local");
  try {
    const text = readFileSync(path, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    console.warn("No .env.local found — set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in the environment.");
  }
}

loadEnvLocal();

const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

if (!clientId || !clientSecret) {
  console.error(
    "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET.\n" +
      "Create OAuth Desktop credentials in Google Cloud Console and add them to .env.local."
  );
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
});

console.log("\n1. Open this URL in your browser and sign in with the Gmail account that will send notifications:\n");
console.log(authUrl);
console.log("\n2. After approving, you will be redirected to localhost.\n");

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", REDIRECT_URI);
  if (url.pathname !== "/oauth2callback") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`Authorization failed: ${error || "missing code"}`);
    server.close();
    process.exit(1);
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      "<html><body><h1>Success</h1><p>You can close this tab and return to the terminal.</p></body></html>"
    );

    console.log("\n✅ Authorization successful. Add these to .env.local:\n");
    if (tokens.refresh_token) {
      console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    } else {
      console.warn(
        "No refresh_token returned. Revoke app access at https://myaccount.google.com/permissions and run again with prompt=consent."
      );
    }
    console.log(`GMAIL_SENDER=your-gmail@gmail.com`);
    console.log(`NOTIFY_EMAIL=where-alerts-should-go@example.com`);
    console.log("");
  } catch (err) {
    console.error("Token exchange failed:", err);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Token exchange failed — see terminal.");
  } finally {
    server.close();
    process.exit(0);
  }
});

server.listen(3333, () => {
  console.log("Waiting for OAuth callback on http://localhost:3333 ...\n");
});
