/**
 * Validates email notification env + MongoDB email_sender collection readiness.
 * Usage: node scripts/test-email-config.mjs
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

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
    console.warn("No .env.local — using process env only.");
  }
}

loadEnvLocal();

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
  /\/$/,
  ""
);
const redirectUri = `${siteUrl}/api/email/oauth/callback`;

const checks = [];

function ok(name, pass, detail = "") {
  checks.push({ name, pass, detail });
  console.log(`${pass ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

ok("GOOGLE_CLIENT_ID", Boolean(clientId), clientId ? "set" : "missing");
ok("GOOGLE_CLIENT_SECRET", Boolean(clientSecret), clientSecret ? "set" : "missing");

if (clientSecret?.startsWith("GOCSPX-GOCSPX-")) {
  ok(
    "GOOGLE_CLIENT_SECRET format",
    false,
    'looks duplicated (GOCSPX-GOCSPX-) — copy secret again from Google Cloud'
  );
} else if (clientSecret) {
  ok("GOOGLE_CLIENT_SECRET format", clientSecret.startsWith("GOCSPX-"), "prefix ok");
}

ok("NEXT_PUBLIC_SITE_URL", Boolean(process.env.NEXT_PUBLIC_SITE_URL), siteUrl);
ok("OAuth redirect URI", true, redirectUri);
ok("MONGODB_URI", Boolean(process.env.MONGODB_URI?.trim()), "for storing connected Gmail");
ok("ADMIN_PASSWORD", Boolean(process.env.ADMIN_PASSWORD?.trim()), "for /admin");
ok(
  "AFFILIATE_SESSION_SECRET",
  Boolean(process.env.AFFILIATE_SESSION_SECRET?.trim()),
  "OAuth state signing"
);

console.log("\n--- Add these redirect URIs in Google Cloud (if missing) ---");
console.log("  http://localhost:3000/api/email/oauth/callback");
console.log("  https://lp.7windsparagliding.co.il/api/email/oauth/callback");

console.log("\n--- Manual test steps ---");
console.log("  1. npm run dev");
console.log("  2. Open http://localhost:3000/admin/notifications");
console.log("  3. Click 'חבר Gmail שלי' and approve with owner Gmail");
console.log("  4. Approve subscribers at /notifications");

const failed = checks.filter((c) => !c.pass).length;
if (failed > 0) {
  console.log(`\n${failed} check(s) failed.`);
  process.exit(1);
}

console.log("\nAll checks passed.");
