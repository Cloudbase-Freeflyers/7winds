import { ObjectId } from "mongodb";
import { affiliateUrl, slugifyCode } from "@/lib/affiliate-utils";
import { getDb } from "@/lib/mongodb";
import type { VoucherPackage } from "@/lib/constants";
import type {
  AffiliateDoc,
  AffiliateEventDoc,
  AffiliateEventType,
  AffiliateStats,
} from "@/types/affiliates";

export { affiliateUrl, slugifyCode };

const PACKAGE_PRICES: Record<VoucherPackage, number> = {
  "10min": 300,
  "20min": 450,
  acro: 500,
  golan: 750,
  gilboa: 750,
};

const DEFAULT_LEAD_VALUE = 400;

let indexEnsured = false;

async function ensureIndexes() {
  if (indexEnsured) return;
  const db = await getDb();
  await db.collection("affiliates").createIndex({ code: 1 }, { unique: true });
  await db
    .collection("affiliate_events")
    .createIndex({ affiliateId: 1, type: 1, createdAt: -1 });
  indexEnsured = true;
}

export async function getAffiliateByCode(
  code: string
): Promise<AffiliateDoc | null> {
  await ensureIndexes();
  const db = await getDb();
  return db.collection<AffiliateDoc>("affiliates").findOne({
    code: code.toLowerCase(),
    status: "active",
  });
}

export async function getAffiliateById(
  id: string
): Promise<AffiliateDoc | null> {
  if (!ObjectId.isValid(id)) return null;
  await ensureIndexes();
  const db = await getDb();
  return db
    .collection<AffiliateDoc>("affiliates")
    .findOne({ _id: new ObjectId(id) });
}

export async function resolveAffiliate(
  code?: string
): Promise<AffiliateDoc | null> {
  if (!code) return null;
  return getAffiliateByCode(code);
}

export async function recordAffiliateEvent(
  affiliate: AffiliateDoc,
  type: AffiliateEventType,
  metadata?: AffiliateEventDoc["metadata"]
) {
  await ensureIndexes();
  const db = await getDb();
  const doc: AffiliateEventDoc = {
    affiliateId: affiliate._id!,
    affiliateCode: affiliate.code,
    type,
    metadata,
    createdAt: new Date(),
  };
  await db.collection<AffiliateEventDoc>("affiliate_events").insertOne(doc);
}

export function estimateEarnings(
  affiliate: AffiliateDoc,
  counts: { leads: number; vouchers: number },
  voucherPackages: VoucherPackage[] = []
): number {
  if (affiliate.commissionType === "fixed") {
    return (counts.leads + counts.vouchers) * affiliate.commissionRate;
  }

  const leadEarnings =
    counts.leads * DEFAULT_LEAD_VALUE * (affiliate.commissionRate / 100);

  const voucherEarnings = voucherPackages.reduce((sum, pkg) => {
    const price = PACKAGE_PRICES[pkg] ?? DEFAULT_LEAD_VALUE;
    return sum + price * (affiliate.commissionRate / 100);
  }, 0);

  return Math.round(leadEarnings + voucherEarnings);
}

export async function getAffiliateStats(
  affiliateId: string
): Promise<AffiliateStats> {
  if (!ObjectId.isValid(affiliateId)) {
    return {
      visits: 0,
      leads: 0,
      vouchers: 0,
      whatsappClicks: 0,
      estimatedEarnings: 0,
      pendingBalance: 0,
    };
  }

  await ensureIndexes();
  const db = await getDb();
  const oid = new ObjectId(affiliateId);

  const affiliate = await db
    .collection<AffiliateDoc>("affiliates")
    .findOne({ _id: oid });

  if (!affiliate) {
    return {
      visits: 0,
      leads: 0,
      vouchers: 0,
      whatsappClicks: 0,
      estimatedEarnings: 0,
      pendingBalance: 0,
    };
  }

  const [visits, leads, vouchers, whatsappClicks, voucherDocs] =
    await Promise.all([
      db.collection("affiliate_events").countDocuments({
        affiliateId: oid,
        type: "visit",
      }),
      db.collection("affiliate_events").countDocuments({
        affiliateId: oid,
        type: "lead",
      }),
      db.collection("affiliate_events").countDocuments({
        affiliateId: oid,
        type: "voucher",
      }),
      db.collection("affiliate_events").countDocuments({
        affiliateId: oid,
        type: "whatsapp_click",
      }),
      db
        .collection<AffiliateEventDoc>("affiliate_events")
        .find({ affiliateId: oid, type: "voucher" })
        .toArray(),
    ]);

  const voucherPackages = voucherDocs
    .map((e) => e.metadata?.package as VoucherPackage | undefined)
    .filter((p): p is VoucherPackage => !!p);

  const estimatedEarnings = estimateEarnings(
    affiliate,
    { leads, vouchers },
    voucherPackages
  );

  return {
    visits,
    leads,
    vouchers,
    whatsappClicks,
    estimatedEarnings,
    pendingBalance: Math.max(0, estimatedEarnings - affiliate.totalPaid),
  };
}

export async function listAffiliates(): Promise<
  (AffiliateDoc & { stats: AffiliateStats })[]
> {
  await ensureIndexes();
  const db = await getDb();
  const affiliates = await db
    .collection<AffiliateDoc>("affiliates")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const withStats = await Promise.all(
    affiliates.map(async (a) => ({
      ...a,
      stats: await getAffiliateStats(String(a._id)),
    }))
  );

  return withStats;
}
