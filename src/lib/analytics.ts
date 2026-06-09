// Lightweight wrappers around GA4 + Meta Pixel that no-op when env IDs are unset.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

function gaEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

function pixelEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", name, params);
}

function withAffiliate(
  params: Record<string, unknown>,
  affiliateCode?: string
) {
  return affiliateCode ? { ...params, affiliate_code: affiliateCode } : params;
}

export const track = {
  lead(source: string, affiliateCode?: string) {
    const params = withAffiliate({ source }, affiliateCode);
    gaEvent("generate_lead", params);
    pixelEvent("Lead", params);
  },
  voucher(pkg: string, affiliateCode?: string) {
    const params = withAffiliate({ item: pkg }, affiliateCode);
    gaEvent("purchase_intent", params);
    pixelEvent("InitiateCheckout", { content_name: pkg, ...params });
  },
  purchase(pkg: string, amount?: number) {
    const params = { item: pkg, ...(amount ? { value: amount, currency: "ILS" } : {}) };
    gaEvent("purchase", params);
    pixelEvent("Purchase", params);
  },
  whatsappClick(label: string, affiliateCode?: string) {
    const params = withAffiliate({ label }, affiliateCode);
    gaEvent("whatsapp_click", params);
    pixelEvent("Contact", { method: "whatsapp", ...params });
  },
  phoneClick(label: string, affiliateCode?: string) {
    const params = withAffiliate({ label }, affiliateCode);
    gaEvent("phone_click", params);
    pixelEvent("Contact", { method: "phone", ...params });
  },
};
