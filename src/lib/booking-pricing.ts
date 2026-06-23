import {
  PACKAGE_LABELS,
  PACKAGE_PRICES,
  type ProductPackage,
} from "@/lib/constants";

export type BookingAudience = "solo" | "group";

export const MAX_FLIGHT_COUNT = 20;
export const FREE_VIDEO_EVERY_N_FLIGHTS = 3;

export function getFreeVideoCount(flightCount: number): number {
  const count = Math.max(0, Math.floor(flightCount));
  return Math.floor(count / FREE_VIDEO_EVERY_N_FLIGHTS);
}

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
  freeVideoCount: number;
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
  const freeVideoCount = getFreeVideoCount(count);
  const videoDiscount = freeVideoCount * PACKAGE_PRICES.media;
  const percentRate = getGroupPercentRate(count);
  const percentDiscount = Math.round(subtotal * percentRate);
  const total = Math.max(0, subtotal - videoDiscount - percentDiscount);

  return {
    flightCount: count,
    unitPrice,
    subtotal,
    freeVideoCount,
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

  const freeVideos = getFreeVideoCount(flightCount);
  if (freeVideos > 0) {
    parts.push(
      freeVideos === 1
        ? "צילום חינם (כל 3 טיסות)"
        : `${freeVideos}× צילום חינם (כל 3 טיסות)`
    );
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
