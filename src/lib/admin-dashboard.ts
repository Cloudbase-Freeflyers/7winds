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
    id: "dev",
    label: "דף בדיקות (dev)",
    path: "/dev",
    description: "בדיקת checkout — ₪5 · noindex",
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
    affiliates: [],
    marketingPages: MAIN_MARKETING_PAGES,
    siteUrl: BRAND.url,
    error: null,
  };

  try {
    const db = await getDb();
    const [leadCount, voucherCount, affiliateLeadCount, affiliateVoucherCount, visitCount, affiliates] =
      await Promise.all([
        db.collection("leads").countDocuments(),
        db.collection("vouchers").countDocuments(),
        db.collection("leads").countDocuments({ affiliateCode: { $exists: true, $ne: "" } }),
        db.collection("vouchers").countDocuments({ affiliateCode: { $exists: true, $ne: "" } }),
        db.collection("affiliate_events").countDocuments({ type: "visit" }),
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
