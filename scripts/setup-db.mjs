/**
 * One-time MongoDB setup: create collections + affiliate indexes.
 * Reads .env.local from project root.
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  const path = resolve(root, ".env.local");
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
}

loadEnvLocal();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "7winds";

if (!uri) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}

const collections = ["leads", "vouchers", "affiliates", "affiliate_events"];

const client = new MongoClient(uri);

try {
  await client.connect();
  console.log("Connected to MongoDB Atlas.");

  const db = client.db(dbName);
  const existing = new Set(
    (await db.listCollections().toArray()).map((c) => c.name)
  );

  for (const name of collections) {
    if (existing.has(name)) {
      console.log(`  collection "${name}" already exists`);
    } else {
      await db.createCollection(name);
      console.log(`  created collection "${name}"`);
    }
  }

  await db.collection("affiliates").createIndex({ code: 1 }, { unique: true });
  await db
    .collection("affiliates")
    .createIndex({ email: 1 }, { unique: true, sparse: true });
  await db
    .collection("affiliate_events")
    .createIndex({ affiliateId: 1, type: 1, createdAt: -1 });

  console.log("Indexes ensured on affiliates + affiliate_events.");
  console.log(`Database "${dbName}" is ready.`);
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error("Setup failed:", msg);
  if (/SSL|tlsv1 alert internal error|ServerSelection/i.test(msg)) {
    console.error(`
Likely cause: your IP is not allowed in MongoDB Atlas.

Fix in Atlas (https://cloud.mongodb.com):
  1. Network Access → Add IP Address
  2. Click "Allow Access from Anywhere" (0.0.0.0/0) for dev, or add your current IP
  3. Wait ~1 minute, then run: npm run setup-db
`);
  }
  process.exit(1);
} finally {
  await client.close();
}
