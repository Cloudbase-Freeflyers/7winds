import { affiliateUrl, listAffiliates } from "@/lib/affiliates";
import { BRAND } from "@/lib/constants";
import { getDb } from "@/lib/mongodb";
import type { AffiliateDoc, AffiliateStats } from "@/types/affiliates";

export interface MarketingPageLink {
  id: string;
  label: string;
  path: string;
  description?: string;
  type: "main" | "section" | "affiliate";
  affiliateCode?: string;
  status?: "active" | "inactive";
}

export const MAIN_MARKETING_PAGES: MarketingPageLink[] = [
  {
    id: "home",
    label: "דף נחיתה ראשי",
    path: "/",
    description: "הדף הראשי — כל הקמפיינים הכלליים",
    type: "main",
  },
  {
    id: "v2",
    label: "דף נחיתה — גרסה 2",
    path: "/v2",
    description: "גרסת וידאו/חוויה — לקמפיינים ממוקדים",
    type: "main",
  },
  {
    id: "dev",
    label: "דף בדיקות (dev)",
    path: "/dev",
    description: "בדיקת checkout — ₪5 · noindex",
    type: "main",
  },
  {
    id: "affiliate-proposal",
    label: "תוכנית עמלות שותפים",
    path: "/affiliate/proposal",
    description: "הצעת מבנה עמלות — noindex",
    type: "main",
  },
  {
    id: "affiliate-login",
    label: "כניסת שותפים",
    path: "/affiliate/login",
    description: "פורטל התחברות לשותפים",
    type: "main",
  },
  {
    id: "pricing",
    label: "מחירים",
    path: "/#pricing",
    description: "סקשן מחירים ומסלולים",
    type: "section",
  },
  {
    id: "voucher",
    label: "שוברי מתנה",
    path: "/#voucher",
    description: "הזמנת שובר מתנה",
    type: "section",
  },
  {
    id: "video",
    label: "וידאו",
    path: "/#video",
    type: "section",
  },
  {
    id: "experience",
    label: "איך זה עובד",
    path: "/#experience",
    type: "section",
  },
  {
    id: "accessibility",
    label: "נגישות",
    path: "/#accessibility",
    type: "section",
  },
  {
    id: "contact",
    label: "צור קשר",
    path: "/#booking",
    description: "טופס הזמנה ותשלום",
    type: "section",
  },
  {
    id: "faq",
    label: "שאלות נפוצות",
    path: "/#faq",
    type: "section",
  },
];

/** Internal management & portal pages — direct admin navigation, not for sharing */
export const SYSTEM_PAGES: MarketingPageLink[] = [
  {
    id: "admin-home",
    label: "לוח בקרה",
    path: "/admin",
    description: "סקירה כללית",
    type: "main",
  },
  {
    id: "admin-leads",
    label: "לידים ושוברים",
    path: "/admin/leads",
    description: "ניהול פניות והזמנות שוברים",
    type: "main",
  },
  {
    id: "admin-affiliates",
    label: "ניהול שותפים",
    path: "/admin/affiliates",
    description: "יצירה, עריכה, QR ותשלומים",
    type: "main",
  },
  {
    id: "affiliate-portal-login",
    label: "כניסת שותפים",
    path: "/affiliate/login",
    description: "פורטל התחברות לשותפים",
    type: "main",
  },
  {
    id: "affiliate-portal-dashboard",
    label: "לוח שותפים",
    path: "/affiliate/dashboard",
    description: "תצוגת השותף (דורש התחברות)",
    type: "main",
  },
];

export interface DashboardAffiliateRow {
  _id: string;
  name: string;
  code: string;
  status: AffiliateDoc["status"];
  payoutStatus: AffiliateDoc["payoutStatus"];
  stats: AffiliateStats;
  url: string;
}

export interface DashboardData {
  totals: {
    leads: number;
    vouchers: number;
    affiliateLeads: number;
    affiliateVouchers: number;
    visits: number;
    activeAffiliates: number;
    pendingPayouts: number;
  };
  revenue: {
    /** Confirmed paid revenue across all orders (₪). */
    paidRevenue: number;
    /** Count of confirmed paid orders. */
    paidOrders: number;
    /** Total commission owed to affiliates on confirmed sales (₪). */
    commissionOwed: number;
    /** Total commission already paid out (₪). */
    commissionPaid: number;
    /** Outstanding commission balance to pay (₪). */
    commissionPending: number;
  };
  affiliates: DashboardAffiliateRow[];
  marketingPages: MarketingPageLink[];
  siteUrl: string;
  error: string | null;
}

function absoluteUrl(path: string): string {
  const base = BRAND.url.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path}`;
}

export async function loadDashboardData(): Promise<DashboardData> {
  const empty: DashboardData = {
    totals: {
      leads: 0,
      vouchers: 0,
      affiliateLeads: 0,
      affiliateVouchers: 0,
      visits: 0,
      activeAffiliates: 0,
      pendingPayouts: 0,
    },
    revenue: {
      paidRevenue: 0,
      paidOrders: 0,
      commissionOwed: 0,
      commissionPaid: 0,
      commissionPending: 0,
    },
    affiliates: [],
    marketingPages: MAIN_MARKETING_PAGES,
    siteUrl: BRAND.url,
    error: null,
  };

  try {
    const db = await getDb();
    const [
      leadCount,
      voucherCount,
      affiliateLeadCount,
      affiliateVoucherCount,
      visitCount,
      paidAgg,
      affiliates,
    ] = await Promise.all([
      db.collection("leads").countDocuments(),
      db.collection("vouchers").countDocuments(),
      db.collection("leads").countDocuments({ affiliateCode: { $exists: true, $ne: "" } }),
      db.collection("vouchers").countDocuments({ affiliateCode: { $exists: true, $ne: "" } }),
      db.collection("affiliate_events").countDocuments({ type: "visit" }),
      db
        .collection("vouchers")
        .aggregate<{ revenue: number; orders: number }>([
          { $match: { paymentStatus: "paid" } },
          {
            $group: {
              _id: null,
              revenue: { $sum: { $ifNull: ["$amount", 0] } },
              orders: { $sum: 1 },
            },
          },
        ])
        .toArray(),
      listAffiliates(),
    ]);

    const affiliateRows: DashboardAffiliateRow[] = affiliates.map((a) => ({
      _id: String(a._id),
      name: a.name,
      code: a.code,
      status: a.status,
      payoutStatus: a.payoutStatus,
      stats: a.stats,
      url: affiliateUrl(a.code),
    }));

    const affiliatePages: MarketingPageLink[] = affiliates.map((a) => ({
      id: `affiliate-${a.code}`,
      label: `שותף: ${a.name}`,
      path: `/a/${a.code}`,
      description: `קוד: ${a.code}`,
      type: "affiliate",
      affiliateCode: a.code,
      status: a.status,
    }));

    const activeAffiliates = affiliates.filter((a) => a.status === "active").length;
    const pendingPayouts = affiliates.filter(
      (a) => a.stats.pendingBalance > 0 || a.payoutStatus === "pending"
    ).length;

    const commissionOwed = affiliates.reduce((sum, a) => sum + a.stats.estimatedEarnings, 0);
    const commissionPaid = affiliates.reduce((sum, a) => sum + a.totalPaid, 0);
    const commissionPending = affiliates.reduce((sum, a) => sum + a.stats.pendingBalance, 0);

    return {
      totals: {
        leads: leadCount,
        vouchers: voucherCount,
        affiliateLeads: affiliateLeadCount,
        affiliateVouchers: affiliateVoucherCount,
        visits: visitCount,
        activeAffiliates,
        pendingPayouts,
      },
      revenue: {
        paidRevenue: paidAgg[0]?.revenue ?? 0,
        paidOrders: paidAgg[0]?.orders ?? 0,
        commissionOwed,
        commissionPaid,
        commissionPending,
      },
      affiliates: affiliateRows,
      marketingPages: [...MAIN_MARKETING_PAGES, ...affiliatePages],
      siteUrl: BRAND.url,
      error: null,
    };
  } catch (err) {
    return {
      ...empty,
      error: err instanceof Error ? err.message : "Failed to load dashboard",
    };
  }
}

export { absoluteUrl };
