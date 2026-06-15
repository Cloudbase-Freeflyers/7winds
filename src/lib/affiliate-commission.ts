import { PACKAGE_PRICES, type ProductPackage } from "@/lib/constants";

/** Tiered commission rates by single-booking value (ILS) */
export const COMMISSION_TIERS = [
  { label: "עד ₪500", min: 0, max: 500, rate: 10 },
  { label: "₪501 – ₪1,000", min: 501, max: 1000, rate: 12 },
  { label: "₪1,001+", min: 1001, max: Infinity, rate: 15 },
] as const;

/** Highest qualifying monthly volume bonus (does not stack across tiers) */
export const VOLUME_BONUSES = [
  { threshold: 5_000, bonus: 250, label: "₪5,000+" },
  { threshold: 10_000, bonus: 750, label: "₪10,000+" },
  { threshold: 20_000, bonus: 2_000, label: "₪20,000+" },
] as const;

/** Representative 7Winds packages mapped to commission tiers */
export const PACKAGE_COMMISSION_EXAMPLES = [
  { package: "10min" as ProductPackage, label: "10 דקות — ארסוף / נתניה", value: PACKAGE_PRICES["10min"] },
  { package: "20min" as ProductPackage, label: "20 דקות — ארסוף / נתניה", value: PACKAGE_PRICES["20min"] },
  { package: "acro" as ProductPackage, label: "אקרובטיקה עם פעלולים", value: PACKAGE_PRICES.acro },
  { package: "golan" as ProductPackage, label: "טיסת טנדם — רמת הגולן", value: PACKAGE_PRICES.golan },
  { package: "gilboa" as ProductPackage, label: "טיסת טנדם — גלבוע", value: PACKAGE_PRICES.gilboa },
  { package: "media" as ProductPackage, label: "תוספת צילום / וידאו", value: PACKAGE_PRICES.media },
] as const;

export const VIP_EXAMPLES = [
  { label: "טנדם + צילום (גלבוע)", value: 900 },
  { label: "זוג טיסות גולן", value: 1_500 },
  { label: "חבילת קבוצה / VIP", value: 2_500 },
] as const;

export function commissionRateForValue(value: number): number {
  for (const tier of COMMISSION_TIERS) {
    if (value >= tier.min && value <= tier.max) return tier.rate;
  }
  return COMMISSION_TIERS[COMMISSION_TIERS.length - 1].rate;
}

export function commissionForBooking(value: number): number {
  return Math.round(value * (commissionRateForValue(value) / 100));
}

export function volumeBonusForRevenue(monthlyRevenue: number): number {
  let bonus = 0;
  for (const tier of VOLUME_BONUSES) {
    if (monthlyRevenue >= tier.threshold) bonus = tier.bonus;
  }
  return bonus;
}

export interface BookingMix {
  label: string;
  count: number;
  value: number;
}

export interface AffiliateScenario {
  id: string;
  title: string;
  subtitle: string;
  monthlyRevenue: number;
  bookings: BookingMix[];
  accent: "sky" | "green" | "yellow";
}

function scenarioTotals(bookings: BookingMix[]) {
  const commission = bookings.reduce(
    (sum, b) => sum + commissionForBooking(b.value) * b.count,
    0
  );
  const revenue = bookings.reduce((sum, b) => sum + b.value * b.count, 0);
  return { commission, revenue };
}

function buildScenario(
  base: AffiliateScenario
): AffiliateScenario & { commission: number; bonus: number; totalPayout: number } {
  const { commission, revenue } = scenarioTotals(base.bookings);
  const bonus = volumeBonusForRevenue(revenue);
  return {
    ...base,
    monthlyRevenue: revenue,
    commission,
    bonus,
    totalPayout: commission + bonus,
  };
}

export const AFFILIATE_SCENARIOS = [
  buildScenario({
    id: "small",
    title: "שותף מתחיל",
    subtitle: "≈ ₪3,000 הכנסה חודשית",
    monthlyRevenue: 0,
    accent: "sky",
    bookings: [
      { label: "טנדם גולן / גלבוע (₪750)", count: 2, value: 750 },
      { label: "20 דקות ארסוף (₪450)", count: 2, value: 450 },
      { label: "אקרובטיקה (₪500)", count: 1, value: 500 },
      { label: "10 דקות (₪300)", count: 1, value: 300 },
    ],
  }),
  buildScenario({
    id: "medium",
    title: "שותף פעיל",
    subtitle: "≈ ₪8,000 הכנסה חודשית",
    monthlyRevenue: 0,
    accent: "green",
    bookings: [
      { label: "טנדם גולן / גלבוע (₪750)", count: 8, value: 750 },
      { label: "אקרובטיקה (₪500)", count: 2, value: 500 },
      { label: "20 דקות ארסוף (₪450)", count: 2, value: 450 },
      { label: "טנדם + צילום (₪900)", count: 1, value: 900 },
    ],
  }),
  buildScenario({
    id: "top",
    title: "שותף מוביל",
    subtitle: "≈ ₪25,000 הכנסה חודשית",
    monthlyRevenue: 0,
    accent: "yellow",
    bookings: [
      { label: "טנדם גולן / גלבוע (₪750)", count: 18, value: 750 },
      { label: "חבילת זוג / קבוצה (₪1,500)", count: 4, value: 1_500 },
      { label: "חבילת VIP (₪2,500)", count: 2, value: 2_500 },
      { label: "אקרובטיקה (₪500)", count: 4, value: 500 },
    ],
  }),
] as const;

/** Data points for the earnings growth chart */
export const CHART_DATA = AFFILIATE_SCENARIOS.map((s) => ({
  label: s.title,
  revenue: s.monthlyRevenue,
  commission: s.commission,
  bonus: s.bonus,
  total: s.totalPayout,
}));

export function formatIls(amount: number): string {
  return `₪${amount.toLocaleString("he-IL")}`;
}
