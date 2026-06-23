import { PACKAGE_PRICES, type ProductPackage } from "@/lib/constants";

/**
 * Monthly-volume commission schedule (client price sheet).
 * The rate an affiliate earns is set by their *confirmed monthly sales volume*:
 *   - up to ₪2,000        → 10%
 *   - ₪2,000 – ₪5,000     → 12%
 *   - above ₪5,000        → 15%
 * This replaces the old per-booking-size tiers and flat bonuses.
 */
export const VOLUME_RATE_TIERS = [
  { label: "עד ₪2,000", min: 0, max: 2_000, rate: 10 },
  { label: "₪2,000 – ₪5,000", min: 2_000, max: 5_000, rate: 12 },
  { label: "מעל ₪5,000", min: 5_000, max: Infinity, rate: 15 },
] as const;

/** Default percent rate before any sales (lowest tier). */
export const BASE_RATE = VOLUME_RATE_TIERS[0].rate;

/**
 * Rate (%) for a given confirmed monthly revenue.
 * Tiers are ascending by `min`; pick the highest tier whose lower bound is exceeded.
 * (min=0 means ≤₪2,000 stays at the base 10% rate.)
 */
export function rateForMonthlyVolume(monthlyRevenue: number): number {
  let rate: number = VOLUME_RATE_TIERS[0].rate;
  for (const tier of VOLUME_RATE_TIERS) {
    if (monthlyRevenue > tier.min) rate = tier.rate;
  }
  return rate;
}

/** Commission earned on a month's confirmed revenue, using its volume tier. */
export function commissionForMonth(monthlyRevenue: number): number {
  return Math.round(monthlyRevenue * (rateForMonthlyVolume(monthlyRevenue) / 100));
}

/** Representative 7Winds packages — shown on the proposal as a price reference. */
export const PACKAGE_COMMISSION_EXAMPLES = [
  { package: "10min" as ProductPackage, label: "10 דקות — ארסוף / נתניה", value: PACKAGE_PRICES["10min"] },
  { package: "20min" as ProductPackage, label: "20 דקות — ארסוף / נתניה", value: PACKAGE_PRICES["20min"] },
  { package: "acro" as ProductPackage, label: "אקרובטיקה עם פעלולים", value: PACKAGE_PRICES.acro },
  { package: "golan" as ProductPackage, label: "טיסת טנדם — רמת הגולן", value: PACKAGE_PRICES.golan },
  { package: "gilboa" as ProductPackage, label: "טיסת טנדם — גלבוע", value: PACKAGE_PRICES.gilboa },
  { package: "media" as ProductPackage, label: "תוספת צילום / וידאו", value: PACKAGE_PRICES.media },
] as const;

/** Special group rate from the price sheet — handled as a manual quote, not the engine. */
export const GROUP_RATE = {
  minParticipants: 50,
  maxParticipants: 100,
  package: "10min" as ProductPackage,
  agentPricePerPerson: 230,
} as const;

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

function scenarioRevenue(bookings: BookingMix[]) {
  return bookings.reduce((sum, b) => sum + b.value * b.count, 0);
}

function buildScenario(
  base: AffiliateScenario
): AffiliateScenario & { rate: number; commission: number; totalPayout: number } {
  const revenue = scenarioRevenue(base.bookings);
  const rate = rateForMonthlyVolume(revenue);
  const commission = commissionForMonth(revenue);
  return {
    ...base,
    monthlyRevenue: revenue,
    rate,
    commission,
    totalPayout: commission,
  };
}

export const AFFILIATE_SCENARIOS = [
  buildScenario({
    id: "small",
    title: "שותף מתחיל",
    subtitle: "מתחת ל-₪2,000 — שיעור 10%",
    monthlyRevenue: 0,
    accent: "sky",
    bookings: [
      { label: "טנדם גולן / גלבוע (₪750)", count: 1, value: 750 },
      { label: "20 דקות ארסוף (₪450)", count: 1, value: 450 },
      { label: "10 דקות (₪300)", count: 2, value: 300 },
    ],
  }),
  buildScenario({
    id: "medium",
    title: "שותף פעיל",
    subtitle: "₪2,000–₪5,000 — שיעור 12%",
    monthlyRevenue: 0,
    accent: "green",
    bookings: [
      { label: "טנדם גולן / גלבוע (₪750)", count: 4, value: 750 },
      { label: "אקרובטיקה (₪500)", count: 1, value: 500 },
      { label: "20 דקות ארסוף (₪450)", count: 1, value: 450 },
    ],
  }),
  buildScenario({
    id: "top",
    title: "שותף מוביל",
    subtitle: "מעל ₪5,000 — שיעור 15%",
    monthlyRevenue: 0,
    accent: "yellow",
    bookings: [
      { label: "טנדם גולן / גלבוע (₪750)", count: 12, value: 750 },
      { label: "טנדם + צילום (₪900)", count: 3, value: 900 },
      { label: "אקרובטיקה (₪500)", count: 4, value: 500 },
    ],
  }),
] as const;

/** Data points for the earnings growth chart */
export const CHART_DATA = AFFILIATE_SCENARIOS.map((s) => ({
  label: s.title,
  revenue: s.monthlyRevenue,
  commission: s.commission,
  total: s.totalPayout,
}));

export function formatIls(amount: number): string {
  return `₪${amount.toLocaleString("he-IL")}`;
}
