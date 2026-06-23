import { ObjectId } from "mongodb";
import { affiliateUrl, slugifyCode } from "@/lib/affiliate-utils";
import { getDb } from "@/lib/mongodb";
import { commissionForMonth } from "@/lib/affiliate-commission";
import { PACKAGE_PRICES, type ProductPackage } from "@/lib/constants";
import type {
  AffiliateDoc,
  AffiliateEventDoc,
  AffiliateEventType,
  AffiliateStats,
} from "@/types/affiliates";
import type { VoucherDoc } from "@/types/submissions";

export { affiliateUrl, slugifyCode };

let indexEnsured = false;

async function ensureIndexes() {
  if (indexEnsured) return;
  const db = await getDb();
  await db.collection("affiliates").createIndex({ code: 1 }, { unique: true });
  await db
    .collection("affiliates")
    .createIndex({ email: 1 }, { unique: true, sparse: true });
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

export async function getAffiliateByEmail(
  email: string
): Promise<AffiliateDoc | null> {
  await ensureIndexes();
  const db = await getDb();
  return db.collection<AffiliateDoc>("affiliates").findOne({
    email: email.trim().toLowerCase(),
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

/** A confirmed, paid order attributed to an affiliate. */
interface PaidOrder {
  amount: number;
  /** Calendar month key (e.g. "2026-06") for monthly-volume tiering. */
  month: string;
}

function orderAmount(doc: VoucherDoc): number {
  if (typeof doc.amount === "number" && doc.amount > 0) return doc.amount;
  return PACKAGE_PRICES[doc.package as ProductPackage] ?? 0;
}

function monthKey(date?: Date): string {
  const d = date ?? new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Commission on confirmed paid orders.
 * - `fixed` affiliates: flat amount per paid order.
 * - `percent` affiliates: monthly-volume schedule — orders are grouped by month,
 *   each month's revenue gets its tier rate, and the months are summed.
 */
export function estimateEarnings(
  affiliate: AffiliateDoc,
  paidOrders: PaidOrder[]
): number {
  if (affiliate.commissionType === "fixed") {
    return paidOrders.length * affiliate.commissionRate;
  }

  const revenueByMonth = new Map<string, number>();
  for (const order of paidOrders) {
    revenueByMonth.set(order.month, (revenueByMonth.get(order.month) ?? 0) + order.amount);
  }

  let total = 0;
  for (const monthlyRevenue of revenueByMonth.values()) {
    total += commissionForMonth(monthlyRevenue);
  }
  return Math.round(total);
}

export async function getAffiliateStats(
  affiliateId: string
): Promise<AffiliateStats> {
  const empty: AffiliateStats = {
    visits: 0,
    leads: 0,
    vouchers: 0,
    whatsappClicks: 0,
    paidOrders: 0,
    referredRevenue: 0,
    estimatedEarnings: 0,
    pendingBalance: 0,
  };

  if (!ObjectId.isValid(affiliateId)) return empty;

  await ensureIndexes();
  const db = await getDb();
  const oid = new ObjectId(affiliateId);

  const affiliate = await db
    .collection<AffiliateDoc>("affiliates")
    .findOne({ _id: oid });

  if (!affiliate) return empty;

  const [visits, leads, vouchers, whatsappClicks, paidDocs] = await Promise.all([
    db.collection("affiliate_events").countDocuments({ affiliateId: oid, type: "visit" }),
    db.collection("affiliate_events").countDocuments({ affiliateId: oid, type: "lead" }),
    db.collection("affiliate_events").countDocuments({ affiliateId: oid, type: "voucher" }),
    db.collection("affiliate_events").countDocuments({ affiliateId: oid, type: "whatsapp_click" }),
    // Commission basis: confirmed paid orders only (vouchers + direct bookings).
    db
      .collection<VoucherDoc>("vouchers")
      .find({ affiliateCode: affiliate.code, paymentStatus: "paid" })
      .toArray(),
  ]);

  const paidOrders = paidDocs.map((doc) => ({
    amount: orderAmount(doc),
    month: monthKey(doc.paidAt ?? doc.createdAt),
  }));

  const referredRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);
  const estimatedEarnings = estimateEarnings(affiliate, paidOrders);

  return {
    visits,
    leads,
    vouchers,
    whatsappClicks,
    paidOrders: paidOrders.length,
    referredRevenue,
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
