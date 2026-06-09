import { BRAND } from "@/lib/constants";
import {
  PACKAGE_INVOICE_DESCRIPTIONS,
  PACKAGE_PRICES,
  type VoucherPackage,
} from "@/lib/constants";

export function getPayPageUrl(): string {
  const url = process.env.ICOUNT_PAYPAGE_URL?.trim();
  if (!url) {
    throw new Error("ICOUNT_PAYPAGE_URL is not configured");
  }
  return url.replace(/\?$/, "");
}

export function getSiteBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || BRAND.url).replace(/\/$/, "");
}

export function getPackagePrice(pkg: VoucherPackage): number {
  return PACKAGE_PRICES[pkg];
}

export function getPackageDescription(pkg: VoucherPackage): string {
  return PACKAGE_INVOICE_DESCRIPTIONS[pkg];
}

export function buildCheckoutRedirectUrl(params: {
  orderId: string;
  amount: number;
  description: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  affiliateCode?: string;
  orderType: "voucher" | "direct";
}): string {
  const url = new URL(getPayPageUrl());
  const site = getSiteBaseUrl();

  url.searchParams.set("cs", String(params.amount));
  url.searchParams.set("cd", params.description);
  url.searchParams.set("full_name", params.buyerName);
  url.searchParams.set("contact_phone", params.buyerPhone);
  url.searchParams.set("contact_email", params.buyerEmail);
  url.searchParams.set(
    "success_url",
    `${site}/payment/success?order=${encodeURIComponent(params.orderId)}`
  );
  url.searchParams.set(
    "failure_url",
    `${site}/payment/failed?order=${encodeURIComponent(params.orderId)}`
  );
  url.searchParams.set(
    "cancel_url",
    `${site}/payment/cancel?order=${encodeURIComponent(params.orderId)}`
  );
  url.searchParams.set("ipn_url", `${site}/api/payments/icount/ipn`);
  url.searchParams.set("m__orderId", params.orderId);
  url.searchParams.set("m__orderType", params.orderType);
  if (params.affiliateCode) {
    url.searchParams.set("m__affiliateCode", params.affiliateCode);
  }

  return url.toString();
}

export function parseIpnPayload(body: string): Record<string, string> {
  const data: Record<string, string> = {};
  const params = new URLSearchParams(body);
  params.forEach((value, key) => {
    data[key] = value;
  });
  return data;
}
