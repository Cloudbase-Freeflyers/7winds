import {
  PACKAGE_LABELS,
  PACKAGE_PRICES,
  type ProductPackage,
} from "@/lib/constants";

export type BookingAudience = "solo" | "group";

export const MAX_FLIGHT_COUNT = 20;

export function getBookingAudience(flightCount: number): BookingAudience {
  return flightCount >= 3 ? "group" : "solo";
}

export function getGroupPercentRate(flightCount: number): number {
  if (flightCount <= 3) return 0;
  if (flightCount <= 5) return 0.03;
  if (flightCount <= 7) return 0.05;
  if (flightCount <= 9) return 0.07;
  return 0.10;
}

export interface BookingPriceBreakdown {
  flightCount: number;
  unitPrice: number;
  subtotal: number;
  videoDiscount: number;
  percentRate: number;
  percentDiscount: number;
  total: number;
  bookingAudience: BookingAudience;
}

export function calculateBookingPrice(
  pkg: ProductPackage,
  flightCount: number
): BookingPriceBreakdown {
  const count = Math.max(1, Math.min(MAX_FLIGHT_COUNT, Math.floor(flightCount)));
  const unitPrice = PACKAGE_PRICES[pkg];
  const subtotal = count * unitPrice;
  const videoDiscount =
    count >= 3 ? count * PACKAGE_PRICES.media : 0;
  const percentRate = getGroupPercentRate(count);
  const percentDiscount = Math.round(subtotal * percentRate);
  const total = Math.max(0, subtotal - videoDiscount - percentDiscount);

  return {
    flightCount: count,
    unitPrice,
    subtotal,
    videoDiscount,
    percentRate,
    percentDiscount,
    total,
    bookingAudience: getBookingAudience(count),
  };
}

export function formatBookingDescription(
  pkg: ProductPackage,
  flightCount: number,
  total: number
): string {
  const label = PACKAGE_LABELS[pkg].replace(/\s*—\s*₪[\d,]+$/, "");
  const parts = [`${flightCount}× ${label}`];

  if (flightCount >= 3) {
    parts.push("צילום חינם לכל טיסה");
  }

  const rate = getGroupPercentRate(flightCount);
  if (rate > 0) {
    parts.push(`הנחה ${Math.round(rate * 100)}%`);
  }

  parts.push(`₪${total}`);
  return `${parts.slice(0, -1).join(" + ")} — ${parts[parts.length - 1]} — 7Winds`;
}

export function formatNis(amount: number): string {
  return `₪${amount.toLocaleString("he-IL")}`;
}
